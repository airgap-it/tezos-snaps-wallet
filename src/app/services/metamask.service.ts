import { Injectable } from '@angular/core';
import { connectSnap, getSnap, sendGetAccount } from '../utils/snap';
import { isFlask } from '../utils/metamask';
import { AccountService, AccountType, StorageKeys } from './account.service';
import { NetworkType } from '@airgap/beacon-wallet';

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  public isConnected: boolean = false;

  constructor(private readonly accountService: AccountService) {
    this.isSnapInstalled().then(
      (isInstalled) => (this.isConnected = isInstalled),
    );
  }

  async connect() {
    console.log('isFlask', await isFlask());

    await connectSnap();
    const installedSnap = await getSnap();
    console.log('snap installed', installedSnap);

    if (localStorage.getItem(StorageKeys.METAMASK_BUSY)) {
      console.log('MetaMask is busy handling another request');
      return;
    }
    localStorage.setItem(StorageKeys.METAMASK_BUSY, 'true');

    const res = await sendGetAccount();

    localStorage.removeItem(StorageKeys.METAMASK_BUSY);

    this.accountService.addOrUpdateAccount({
      address: res.address,
      publicKey: res.publicKey,
      type: AccountType.METAMASK,
      description: '',
      tags: [],
      network: NetworkType.MAINNET,
      wallet: { name: 'MetaMask' },
    });

    this.isSnapInstalled().then(
      (isInstalled) => (this.isConnected = isInstalled),
    );
  }

  async disconnect() {
    alert('NOT IMPLEMENTED');
  }

  private async isSnapInstalled(): Promise<boolean> {
    const installedSnap = await getSnap();

    return Boolean(installedSnap);
  }
}
