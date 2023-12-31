import { PeerInfo, PermissionInfo } from '@airgap/beacon-types';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Account, AccountService } from './services/account.service';
import { ApiService } from './services/api.service';
import { BeaconService } from './services/beacon.service';
import { NavigationEnd, Router } from '@angular/router';
import { TabSyncService } from './services/tab-sync.service';
import { Token } from './types';
import BigNumber from 'bignumber.js';
import { MetamaskService } from './services/metamask.service';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  balance: string = '0';
  usdBalance: string = '0';
  address: string = '';
  operations: {
    id: number;
    hash: string;
    type: 'transaction' | string;
    amount: number;
    sender: { address: string };
    target: { address: string };
    timestamp: string;
  }[] = [];

  price: number = 0;
  nfts: Token[] = [];
  tokens: Token[] = [];

  isLoading: boolean = true;

  isCollapsed = true;

  syncCode: string = '';

  connected: boolean = false;

  accounts$: Observable<Account[]>;

  peersAndPermissions: [PeerInfo, PermissionInfo[]][] = [];

  selectedNodes: [string, string][] = [];

  constructor(
    public readonly api: ApiService,
    public readonly beacon: BeaconService,
    public readonly metamaskService: MetamaskService,
    public readonly accountService: AccountService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly tabSyncService: TabSyncService,
  ) {
    this.accounts$ = this.accountService.accounts$;
    this.loadNodes();
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        const url = `https://placeholder.com/${event.url}`;
        if (url.includes('?type=tzip10&data=')) {
          console.log(url);

          // Deeplink handler for beacon
          const params: URLSearchParams = new URL(url).searchParams;
          const payload = params.get('data');
          if (payload) {
            console.log('ADDING PEER');
            await this.beacon.addPeer(payload);
            this.router.navigate(['/']);
          }
        }
      }
    });

    setInterval(() => {
      this.loadAccountInfo();
    }, 10000);
    this.loadAccountInfo();
  }

  loadAccountInfo() {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        const address = accounts[0].address;

        this.address = address;

        Promise.all([
          this.api.getXtzPrice(),
          this.api.getBalanceOfAddress(address),
          this.api.getOperationHistory(address),
          this.api.getTokenTransactionHistory(address),
          this.api.getNftBalances(address),
          this.api.getTokenBalances(address),
        ]).then(
          ([
            price,
            balance,
            operations,
            tokenTransfers,
            nftBalances,
            tokenBalances,
          ]) => {
            this.isLoading = false;

            this.balance = balance.shiftedBy(-6).toString(10);
            const mergedOperations = [
              ...operations,
              ...tokenTransfers.map((el) => {
                const item = { ...el, type: 'tokenTransfer' };
                item.formattedAmount = new BigNumber(item.amount)
                  .shiftedBy(
                    -new BigNumber(
                      item?.token?.metadata?.decimals ?? 0,
                    ).toNumber(),
                  )
                  .decimalPlaces(6)
                  .toString(10);
                return item;
              }),
            ]
              .sort((a, b) => b.id - a.id)
              .slice(0, 10);

            // Only update reference if content changed
            if (
              mergedOperations.some((el, index) => {
                return el?.id !== this.operations[index]?.id;
              })
            ) {
              this.operations = mergedOperations;
            }

            // Only update reference if content changed
            if (
              nftBalances.some((el, index) => {
                return el?.id !== this.nfts[index]?.id;
              })
            ) {
              this.nfts = nftBalances;
            }

            // Only update reference if content changed
            if (
              tokenBalances.some((el, index) => {
                return (
                  el?.id !== this.tokens[index]?.id ||
                  el?.humanReadableBalance !==
                    this.tokens[index]?.humanReadableBalance
                );
              })
            ) {
              this.tokens = tokenBalances;
            }

            this.price = price;

            this.usdBalance = new BigNumber(this.balance)
              .times(this.price)
              .decimalPlaces(2)
              .toString(10);

            console.log('BALANCE: ', this.balance);
            console.log('TXs: ', this.operations);
            console.log('tokenTransfers: ', tokenTransfers);
            console.log('NFTs: ', this.nfts);
            console.log('TOKENs: ', this.tokens);
          },
        );
      }
    });
  }

  loadNodes() {
    this.selectedNodes = Object.entries(this.api.RPCs)
      .filter((element) => element[1].all.length > 0)
      .map((element) => [element[0], element[1].selected]);
  }

  async ngOnInit() {
    this.connected = await this.beacon.walletClient.isConnected;
    this.getPeers();
  }

  async paste() {
    navigator.clipboard.readText().then(async (clipText) => {
      try {
        this.syncCode = clipText;
      } catch {}
    });
  }

  async connect() {
    const bsModalRef = this.modalService.showLoadingModal();

    setTimeout(() => {
      this.beacon.addPeer(this.syncCode).finally(() => bsModalRef.hide());
    }, 500);
  }

  async getPeers() {
    const peers = await this.beacon.walletClient.getPeers();
    const permissions = await this.beacon.walletClient.getPermissions();

    this.peersAndPermissions = peers.map((peer) => {
      return [
        peer,
        permissions.filter((perm) => perm.senderId === (peer as any).senderId),
      ];
    });
  }

  async removePeer(ev: MouseEvent, peer: PeerInfo) {
    ev.stopPropagation();
    const bsModalRef = this.modalService.showConfirmModal(async () => {
      await this.beacon.walletClient.removePeer(peer as any, true);
      this.getPeers();
    });
  }

  async removePermission(permission: PermissionInfo) {
    const bsModalRef = this.modalService.showConfirmModal(async () => {
      await this.beacon.walletClient.removePermission(
        permission.accountIdentifier,
      );
      this.getPeers();
    });
  }

  async removeAccount(account: Account) {
    const bsModalRef = this.modalService.showConfirmModal(() => {
      this.accountService.removeAccount(account);
    });
  }

  openNodeSelectorModal() {
    const bsModalRef = this.modalService.showNodeSelectorModal();
    bsModalRef.onHide?.subscribe(() => {
      this.loadNodes();
    });
  }

  openHowToModal() {
    this.modalService.showHowToModal();
  }
}
