import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { sendSetRpc } from '../../utils/snap';
import { ToastService } from '../../services/toast.service';
import {
  ApiService,
  NetworkDisplayType,
  PREDEFINED_RPCS,
} from '../../services/api.service';

@Component({
  selector: 'app-rpc-url-modal',
  templateUrl: './rpc-url-modal.component.html',
  styleUrls: ['./rpc-url-modal.component.scss'],
})
export class RpcUrlModalComponent implements OnInit {
  public customRpcUrl: string = '';
  public customTzktUrl: string = '';
  public selectedNetworkType: NetworkDisplayType = 'mainnet';
  public networkTypes: NetworkDisplayType[] = [
    'mainnet',
    'ghostnet',
    'shadownet',
    'custom',
  ];
  public isLoading: boolean = false;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly toastService: ToastService,
    public readonly apiService: ApiService,
  ) {}

  ngOnInit(): void {
    // Initialize with current values
    this.selectedNetworkType = this.apiService.networkDisplayType;
    this.customTzktUrl = this.apiService.customTzktUrl;

    // If custom network is selected, load the custom RPC URL
    if (this.selectedNetworkType === 'custom') {
      this.customRpcUrl = this.apiService.currentRpcUrl;
    }
  }

  onNetworkTypeChange(networkType: NetworkDisplayType) {
    this.selectedNetworkType = networkType;
  }

  getRpcUrlForNetwork(networkType: NetworkDisplayType): string {
    if (networkType === 'custom') {
      return this.customRpcUrl;
    }
    return PREDEFINED_RPCS[networkType];
  }

  async setRpc() {
    if (
      this.selectedNetworkType === 'custom' &&
      !this.customRpcUrl.trim()
    ) {
      this.toastService.showTxErrorToast();
      return;
    }

    this.isLoading = true;

    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error(
          'MetaMask is not installed. Please install MetaMask and try again.',
        );
      }

      // Check if the Tezos snap is installed
      const { getSnap } = await import('../../utils/snap');
      const installedSnap = await getSnap();

      if (!installedSnap) {
        throw new Error(
          'Tezos snap is not installed. Please install the Tezos snap in MetaMask first.',
        );
      }

      console.log('Installed snap:', installedSnap);

      const rpcUrl = this.getRpcUrlForNetwork(this.selectedNetworkType);

      await sendSetRpc(this.selectedNetworkType, rpcUrl);

      // Update API service with the new network type
      this.apiService.setNetworkByDisplayType(
        this.selectedNetworkType,
        this.selectedNetworkType === 'custom' ? this.customRpcUrl.trim() : undefined,
      );

      // Save custom tzkt URL if custom network is selected
      if (this.selectedNetworkType === 'custom') {
        this.apiService.setCustomTzktUrl(this.customTzktUrl.trim());
      }

      this.toastService.showTxSuccessToast();
      this.bsModalRef.hide();

      // Reload the page to reflect the new network state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Error setting RPC URL:', error);
      this.toastService.showTxErrorToast();
    } finally {
      this.isLoading = false;
    }
  }
}
