import { PeerInfo, PermissionInfo } from '@airgap/beacon-types';
import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AccountsOverviewComponent } from './components/accounts-overview/accounts-overview.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { HowToModalComponent } from './components/how-to-modal/how-to-modal.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { NodeSelectorModalComponent } from './components/node-selector-modal/node-selector-modal.component';
import { Account, AccountService } from './services/account.service';
import { ApiService } from './services/api.service';
import { BeaconService, LogAction } from './services/beacon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed = true;

  syncCode: string = '';

  connected: boolean | undefined;

  accounts$: Observable<Account[]>;

  peersAndPermissions: [PeerInfo, PermissionInfo[]][] = [];

  selectedNodes: [string, string][] = [];

  constructor(
    public readonly api: ApiService,
    public readonly beacon: BeaconService,
    private readonly accountService: AccountService,
    private readonly modalService: BsModalService
  ) {
    this.accounts$ = this.accountService.accounts$;
    this.loadNodes();
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
    const bsModalRef = this.modalService.show(LoadingModalComponent, {});

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

  async removePeer(peer: PeerInfo) {
    const bsModalRef = this.modalService.show(ConfirmModalComponent, {});

    bsModalRef.onHide?.pipe(first()).subscribe(async (result) => {
      if (result === 'confirm') {
        await this.beacon.walletClient.removePeer(peer as any, true);
        this.getPeers();
      }
    });
  }

  async removePermission(permission: PermissionInfo) {
    const bsModalRef = this.modalService.show(ConfirmModalComponent, {});

    bsModalRef.onHide?.pipe(first()).subscribe(async (result) => {
      if (result === 'confirm') {
        await this.beacon.walletClient.removePermission(
          permission.accountIdentifier
        );
        this.getPeers();
      }
    });
  }

  async removeAccount(account: Account) {
    const bsModalRef = this.modalService.show(ConfirmModalComponent, {});

    bsModalRef.onHide?.pipe(first()).subscribe((result) => {
      if (result === 'confirm') {
        this.accountService.removeAccount(account);
      }
    });
  }

  async openAccountsOverview() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    const bsModalRef = this.modalService.show(
      AccountsOverviewComponent,
      initialState
    );
    (bsModalRef.content as any).closeBtnName = 'Close';
  }

  openNodeSelectorModal() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    const bsModalRef = this.modalService.show(
      NodeSelectorModalComponent,
      initialState
    );
    bsModalRef.onHide?.subscribe(() => {
      this.loadNodes();
    });
  }

  openHowToModal() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    const bsModalRef = this.modalService.show(
      HowToModalComponent,
      initialState
    );
    (bsModalRef.content as any).closeBtnName = 'Close';
  }

  action(ev: Event, logItem: any, item: LogAction) {
    ev.preventDefault();
    ev.stopPropagation();
    item.action();
    logItem[3].length = 0;
  }
}
