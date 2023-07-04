import { Injectable } from '@angular/core';
import { connectSnap, getSnap, sendGetAccount } from '../utils/snap';
import { isFlask } from '../utils/metamask';
import { AccountService, AccountType } from './account.service';
import { NetworkType } from '@airgap/beacon-dapp';

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  public isConnected: boolean = false;

  constructor(private readonly accountService: AccountService) {
    this.isSnapInstalled().then(
      (isInstalled) => (this.isConnected = isInstalled)
    );
  }

  async connect() {
    console.log(await isFlask());

    await connectSnap();
    const installedSnap = await getSnap();
    console.log(installedSnap);

    const res = await sendGetAccount();

    this.accountService.addOrUpdateAccount({
      address: res.address,
      publicKey: res.publicKey,
      type: AccountType.METAMASK,
      description: '',
      tags: [],
      network: NetworkType.MAINNET,
      wallet: { name: 'MetaMask' },
    });
  }

  async disconnect() {
    alert('NOT IMPLEMENTED');
  }

  private async isSnapInstalled(): Promise<boolean> {
    const installedSnap = await getSnap();

    return Boolean(installedSnap);
  }
}
