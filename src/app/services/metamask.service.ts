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

  async loadRpcConfig(): Promise<boolean> {
    this.apiService.networkLoading = true;
    this.apiService.networkLoadError = false;

    try {
      const rpcConfig = await sendGetRpc();
      console.log('[loadRpcConfig] Snap returned:', rpcConfig);

      // The snap may return nodeUrl or rpcUrl
      const rpcUrl = rpcConfig?.rpcUrl || rpcConfig?.nodeUrl;

      if (rpcConfig?.network && rpcUrl) {
        console.log('[loadRpcConfig] Calling setRpcFromSnap with:', {
          network: rpcConfig.network,
          rpcUrl,
        });
        this.apiService.setRpcFromSnap(rpcConfig.network, rpcUrl);
        this.apiService.networkLoadError = false;
        return true;
      } else {
        console.log('[loadRpcConfig] Missing network or rpcUrl, not updating');
        this.apiService.networkLoadError = true;
        return false;
      }
    } catch (error) {
      console.error('Failed to load RPC config from snap:', error);
      this.apiService.networkLoadError = true;
      return false;
    } finally {
      this.apiService.networkLoading = false;
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
    console.log('[connect] Snap returned RPC config:', rpcConfig);

    localStorage.removeItem(StorageKeys.METAMASK_BUSY);

    // Update API service with the RPC from the snap (may be rpcUrl or nodeUrl)
    const rpcUrl = rpcConfig?.rpcUrl || rpcConfig?.nodeUrl;
    if (rpcConfig?.network && rpcUrl) {
      this.apiService.setRpcFromSnap(rpcConfig.network, rpcUrl);
    }

    // Map snap network to NetworkType
    let network: NetworkType;
    switch (rpcConfig?.network) {
      case 'ghostnet':
        network = NetworkType.GHOSTNET;
        break;
      case 'shadownet':
        network = NetworkType.SHADOWNET;
        break;
      case 'custom':
        network = NetworkType.CUSTOM;
        break;
      default:
        network = NetworkType.MAINNET;
        break;
    }

    // Mark network loading as complete
    this.apiService.networkLoading = false;
    this.apiService.networkLoadError = false;

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
