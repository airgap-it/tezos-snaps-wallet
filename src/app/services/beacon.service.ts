import {
  NetworkType,
  BeaconMessageType,
  BeaconErrorType,
  PermissionRequestOutput,
  PermissionScope,
  OperationRequestOutput,
  SignPayloadRequestOutput,
  PartialTezosOperation,
  PartialTezosTransactionOperation,
  BeaconRequestOutputMessage,
  OperationResponseInput,
  SignPayloadResponseInput,
} from '@airgap/beacon-types';
import { WalletClient } from '@airgap/beacon-wallet';
import { Serializer } from '@airgap/beacon-core';
import { Injectable } from '@angular/core';

import { first } from 'rxjs/operators';

import { RpcClient, OperationContents, OpKind } from '@taquito/rpc';
import { Account, AccountService, AccountType } from './account.service';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ApiService } from './api.service';
import { sendOperationRequest, sendSignRequest } from '../utils/snap';
import { StorageEvents, TabSyncService } from './tab-sync.service';
import { ModalService } from './modal.service';

export interface LogAction {
  title: string;
  action: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class BeaconService {
  public walletClient: WalletClient;

  log: [Date, string, any, LogAction[]][] = [];

  private modalRef: BsModalRef<any> | undefined;

  constructor(
    private readonly tabSyncService: TabSyncService,
    private readonly accountService: AccountService,
    private readonly modalService: ModalService,
    private readonly apiService: ApiService
  ) {
    this.walletClient = new WalletClient({
      name: 'Tezos Wallet for MetaMask',
    });

    this.connect();

    this.tabSyncService.clear$.subscribe(() => {
      this.modalRef?.hide();
    });
  }
  async handleMessage(message: BeaconRequestOutputMessage) {
    this.log.push([
      new Date(),
      `${message.appMetadata.name}: INCOMING MESSAGE (${message.type}) ${
        message.type === BeaconMessageType.OperationRequest
          ? `${
              message.operationDetails.length === 1
                ? `${
                    (message.operationDetails[0] as any)?.amount
                  } mutez, Entrypoint: ${
                    (message.operationDetails[0] as any)?.parameters?.entrypoint
                  }`
                : `${message.operationDetails.length} operations`
            }`
          : ''
      }`,
      message,
      [],
    ]);
    console.log('message', message);

    this.accountService.accounts$.pipe(first()).subscribe((accounts) => {
      if (message.type === BeaconMessageType.PermissionRequest) {
        if (accounts.length === 0) {
          console.error('No account found');

          this.modalRef = this.modalService.showNotConnectedModal(
            () => {
              console.log('SUCCESS');
              this.handleMessage(message);
            },
            () => {
              console.log('ERROR');
            }
          );

          return;
        }

        this.modalRef = this.modalService.showPermissionModal(
          accounts[0],
          message.appMetadata
        );

        this.modalRef.onHide?.pipe(first()).subscribe((result) => {
          this.tabSyncService.sendEvent(StorageEvents.CLEAR);
          if (result && result === 'confirm') {
            this.handlePermissionRequest(accounts[0], message);
          } else {
            this.sendAbortedError(message);
            console.log('DENIED', result);
          }
        });
      } else if (message.type === BeaconMessageType.OperationRequest) {
        const account = accounts.find(
          (acc) => acc.address === message.sourceAddress
        );
        if (!account) {
          console.error('No account found for ' + message.sourceAddress);
          return;
        }
        this.modalRef = this.modalService.showOperationModal();

        this.modalRef.onHide?.pipe(first()).subscribe((result) => {
          this.tabSyncService.sendEvent(StorageEvents.CLEAR);
          if (result && result === 'confirm') {
            this.handleOperationRequest(account, message);
          } else {
            this.sendAbortedError(message);
            console.log('DENIED', result);
          }
        });
      } else if (message.type === BeaconMessageType.SignPayloadRequest) {
        const account = accounts.find(
          (acc) => acc.address === message.sourceAddress
        );
        if (!account) {
          console.error('No account found for ' + message.sourceAddress);
          return;
        }

        this.modalRef = this.modalService.showSignModal();

        this.modalRef.onHide?.pipe(first()).subscribe((result) => {
          this.tabSyncService.sendEvent(StorageEvents.CLEAR);
          if (result && result === 'confirm') {
            this.handleSignPayload(account, message);
          } else {
            this.sendAbortedError(message);
            console.log('DENIED', result);
          }
        });
      } else {
        console.error('Message type not supported');
        console.error('Received: ', message);

        const response = {
          type: BeaconMessageType.Error,
          id: message.id,
          errorType: BeaconErrorType.ABORTED_ERROR,
        };
        this.walletClient.respond(response as any);
      }
    });
  }

  connect() {
    // Handle incoming messages from beacon and relay it to MetaMask
    this.walletClient.init().then(async () => {
      this.walletClient
        .connect(this.handleMessage.bind(this))
        .catch((error) => console.error('connect error', error));
    }); // Establish P2P connection
  }

  private async sendAbortedError(message: any) {
    const response: any = {
      type: BeaconMessageType.Error,
      id: message.id,
      errorType: BeaconErrorType.ABORTED_ERROR,
    };

    this.walletClient.respond(response);
  }

  public async addPeer(text: string) {
    const serializer = new Serializer();
    return serializer
      .deserialize(text)
      .then((peer) => {
        console.log('Adding peer', peer);
        return this.walletClient.addPeer(peer as any).then(() => {
          console.log('Peer added');
        });
      })
      .catch((e) => {
        console.error('not a valid sync code: ', e, text);
      });
  }

  private handlePermissionRequest(
    account: Account,
    message: PermissionRequestOutput
  ) {
    console.log('Sharing ', account);

    const response = {
      type: BeaconMessageType.PermissionResponse,
      network: message.network,
      scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN],
      id: message.id,
      publicKey: account.publicKey,
    };

    // Send response back to DApp
    this.walletClient.respond(response as any);
  }

  public async handleOperationRequest(
    account: Account,
    message: OperationRequestOutput
  ) {
    const operations: PartialTezosOperation[] = message.operationDetails;

    console.log('RPCs', (this.apiService.RPCs as any)[message.network.type]);

    const client = new RpcClient(
      (this.apiService.RPCs as any)[message.network.type].selected
    );

    const { counter } = await client.getContract(account.address);
    console.log('COUNTER FROM API', counter);
    let nextCounter = parseInt(counter || '0', 10) + 1;
    console.log('nextCounter', nextCounter);
    const branch = (await client.getBlockHeader()).hash;
    // RPC requires a signature but does not verify it
    const SIGNATURE_STUB =
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
    const chainId = await client.getChainId();

    const typedOperations: OperationContents[] = operations.map(
      (op) =>
        ({
          source: account.address,
          counter: String(nextCounter++),
          fee: '10000',
          gas_limit: '1040000',
          storage_limit: '60000',
          ...(op as PartialTezosTransactionOperation),
          kind: OpKind.TRANSACTION,
        } as any)
    );

    client
      .runOperation({
        operation: {
          branch,
          contents: typedOperations,
          signature: SIGNATURE_STUB,
        },
        chain_id: chainId,
      })
      .then((res) => {
        console.log('RUN_OPERATION RESULT', res);
      })
      .catch((err) => {
        console.log('RUN_OPERATION ERROR', err);
      })
      .finally(async () => {
        console.log('METAMASK SENDING OPERATION REQUEST');
        let response: OperationResponseInput | any;
        try {
          const result = await sendOperationRequest(operations);
          response = {
            id: message.id,
            type: BeaconMessageType.OperationResponse,
            transactionHash: result,
          };
        } catch (e) {
          response = {
            type: BeaconMessageType.Error,
            id: message.id,
            errorType: BeaconErrorType.ABORTED_ERROR,
          };
        }

        console.log('RESPONSE', response);

        this.walletClient.respond(response);
      });
  }

  private async handleSignPayload(
    account: Account,
    message: SignPayloadRequestOutput
  ) {
    console.log('METAMASK SIGN REQUEST', message);
    let response: SignPayloadResponseInput | any;
    try {
      const result = await sendSignRequest(message.payload);
      response = {
        id: message.id,
        type: BeaconMessageType.SignPayloadResponse,
        signature: result,
        signingType: message.signingType,
      };
    } catch (e) {
      response = {
        type: BeaconMessageType.Error,
        id: message.id,
        errorType: BeaconErrorType.ABORTED_ERROR,
      };
    }

    this.walletClient.respond(response);

    console.log('METAMASK SIGN RESPONSE', response);
  }
}