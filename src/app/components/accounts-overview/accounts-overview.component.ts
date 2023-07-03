import { NetworkType } from '@airgap/beacon-types';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import {
  Account,
  AccountService,
  AccountType,
} from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';

@Component({
  selector: 'app-accounts-overview',
  templateUrl: './accounts-overview.component.html',
  styleUrls: ['./accounts-overview.component.scss'],
})
export class AccountsOverviewComponent implements OnInit {
  title?: string;
  closeBtnName?: string;
  list: any[] = [];

  address: string = '';

  accounts$: Observable<Account[]>;

  constructor(
    private readonly api: ApiService,
    private readonly beacon: BeaconService,
    private readonly accountService: AccountService,
    public readonly bsModalRef: BsModalRef
  ) {
    this.accounts$ = this.accountService.accounts$;
  }

  ngOnInit(): void {}

  async addBeaconWallet() {
    await this.beacon.dAppClient.clearActiveAccount();

    const permissions = await this.beacon.dAppClient.requestPermissions({
      network: {
        type: NetworkType.MAINNET,
      },
    });

    const peers = await this.beacon.dAppClient.getPeers();

    const peer = peers.find(
      (peer) => (peer as any).senderId === permissions.senderId
    );

    this.accountService.addOrUpdateAccount({
      address: permissions.address,
      publicKey: permissions.publicKey,
      type: AccountType.BEACON,
      description: '',
      tags: [],
      network: NetworkType.MAINNET, // TODO: Remove?
      wallet: { name: peer?.name ?? '' },
    });

    this.bsModalRef.hide();
  }

  async addWatchOnlyWallet() {
    const publicKeyInfo = await this.api.getPublicKeyForAddress(this.address);
    if (!publicKeyInfo) {
      throw new Error('NO PUBLIC KEY FOUND, PLEASE REVEAL ADDRESS');
    }

    this.accountService.addOrUpdateAccount({
      address: this.address,
      publicKey: publicKeyInfo.publicKey,
      type: AccountType.WATCH_ONLY,
      description: '',
      tags: [],
      network: publicKeyInfo.network,
      wallet: { name: '' },
    });

    this.bsModalRef.hide();
  }

  async addMnemonic() {}
}
