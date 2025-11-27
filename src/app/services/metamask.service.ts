import { Injectable } from '@angular/core';
import { connectSnap, getSnap, sendGetAccount, sendGetRpc } from '../utils/snap';
import { isFlask } from '../utils/metamask';
import { AccountService, AccountType, StorageKeys } from './account.service';
import { NetworkType } from '@airgap/beacon-wallet';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  public isConnected: boolean = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly apiService: ApiService,
  ) {
    this.isSnapInstalled().then((isInstalled) => {
      this.isConnected = isInstalled;
      if (isInstalled) {
        this.loadRpcConfig();
      }
    });
  }

  async loadRpcConfig() {
    try {
      const rpcConfig = await sendGetRpc();
      if (rpcConfig?.network && rpcConfig?.rpcUrl) {
        this.apiService.setRpcFromSnap(rpcConfig.network, rpcConfig.rpcUrl);
      }
    } catch (error) {
      console.error('Failed to load RPC config from snap:', error);
    }
  }

  async connect() {
    console.log('isFlask', await isFlask());

    await connectSnap();
    const installedSnap = await getSnap();
    console.log('snap installed', installedSnap);

    if (localStorage.getItem(StorageKeys.METAMASK_BUSY)) {
      console.log('MetaMaskService: MetaMask is busy handling another request');
      throw new Error('MetaMask is busy handling another request');
    }
    localStorage.setItem(StorageKeys.METAMASK_BUSY, 'true');

    const res = await sendGetAccount();
    const rpcConfig = await sendGetRpc();

    localStorage.removeItem(StorageKeys.METAMASK_BUSY);

    // Update API service with the RPC from the snap
    if (rpcConfig?.network && rpcConfig?.rpcUrl) {
      this.apiService.setRpcFromSnap(rpcConfig.network, rpcConfig.rpcUrl);
    }

    const network =
      rpcConfig?.network === 'ghostnet'
        ? NetworkType.GHOSTNET
        : NetworkType.MAINNET;

    this.accountService.addOrUpdateAccount({
      address: res.address,
      publicKey: res.publicKey,
      type: AccountType.METAMASK,
      description: '',
      tags: [],
      network,
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
