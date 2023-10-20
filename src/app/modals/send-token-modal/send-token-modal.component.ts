import {
  NetworkType,
  PartialTezosTransactionOperation,
  TezosOperationType,
  TezosTransactionOperation,
} from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';
import { ToastService } from 'src/app/services/toast.service';
import { Token } from 'src/app/types';
import { sendOperationRequest } from 'src/app/utils/snap';
import { prepareOperations } from 'src/app/utils/tezos/prepare-operations';

@Component({
  selector: 'app-send-token-modal',
  templateUrl: './send-token-modal.component.html',
  styleUrls: ['./send-token-modal.component.scss'],
})
export class SendTokenModalComponent implements OnInit {
  token: Token | undefined;
  recipient: string = '';
  amount: string = '';
  fee?: string;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly apiService: ApiService,
    public readonly accountService: AccountService,
    public readonly beaconService: BeaconService,
    public readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {}

  async send() {
    const FA2Transfer = (
      contract: string,
      from: string,
      to: string,
      tokenId: string,
      amount: string,
    ): PartialTezosTransactionOperation => {
      return {
        kind: TezosOperationType.TRANSACTION,
        amount: '0',
        destination: contract,
        parameters: {
          entrypoint: 'transfer',
          value: [
            {
              prim: 'Pair',
              args: [
                {
                  string: from,
                },
                [
                  {
                    prim: 'Pair',
                    args: [
                      {
                        string: to,
                      },
                      {
                        prim: 'Pair',
                        args: [
                          {
                            int: tokenId,
                          },
                          {
                            int: amount,
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      };
    };

    const FA1p2Transfer = (
      contract: string,
      from: string,
      to: string,
      amount: string,
    ): PartialTezosTransactionOperation => {
      return {
        kind: TezosOperationType.TRANSACTION,
        amount: '0',
        destination: contract,
        parameters: {
          entrypoint: 'transfer',
          value: {
            prim: 'Pair',
            args: [
              {
                string: from,
              },
              {
                prim: 'Pair',
                args: [
                  {
                    string: to,
                  },
                  {
                    int: amount,
                  },
                ],
              },
            ],
          },
        },
      };
    };

    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (!this.token) {
        return;
      }

      const account = accounts[0];
      const adjustedAmount = new BigNumber(this.amount)
        .shiftedBy(new BigNumber(this.token.token.metadata.decimals).toNumber())
        .toString(10);

      const operations: PartialTezosTransactionOperation[] = [
        this.token.token.standard === 'fa2'
          ? FA2Transfer(
              this.token.token.contract.address,
              account.address,
              this.recipient,
              this.token.token.tokenId,
              adjustedAmount,
            )
          : FA1p2Transfer(
              this.token.token.contract.address,
              account.address,
              this.recipient,
              adjustedAmount,
            ),
      ];

      try {
        const estimated = await prepareOperations(
          account.address,
          account.publicKey,
          operations,
          (this.apiService.RPCs as any)[NetworkType.MAINNET].selected + '/',
        );

        this.fee = new BigNumber(
          (estimated.contents[0] as TezosTransactionOperation).fee,
        )
          .div(1_000_000)
          .toString();

        const result = await sendOperationRequest(operations);
        this.toastService.showTxSuccessToast();

        console.log('RESULT', result);
      } catch (e) {
        this.toastService.showTxErrorToast();
      }
      this.bsModalRef.hide();
    });
  }

  onAmountChanged(amount: string) {
    this.amount = amount;
  }
}
