import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NetworkType } from '@airgap/beacon-types';
import { sendSetRpc } from '../../utils/snap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-rpc-url-modal',
  templateUrl: './rpc-url-modal.component.html',
  styleUrls: ['./rpc-url-modal.component.scss'],
})
export class RpcUrlModalComponent implements OnInit {
  public rpcUrl: string = '';
  public selectedNetwork: NetworkType = NetworkType.MAINNET;
  public networks: string[] = [NetworkType.MAINNET, NetworkType.GHOSTNET];
  public isLoading: boolean = false;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {}

  onNetworkChange(network: string) {
    this.selectedNetwork = network as NetworkType;
  }

  async setRpc() {
    if (!this.rpcUrl.trim()) {
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

      await sendSetRpc(
        this.selectedNetwork as 'mainnet' | 'ghostnet',
        this.rpcUrl.trim(),
      );
      this.toastService.showTxSuccessToast();
      this.bsModalRef.hide();
    } catch (error: any) {
      console.error('Error setting RPC URL:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to set RPC URL';
      if (error?.code === -32603) {
        errorMessage =
          'MetaMask or Tezos snap is not properly connected. Please ensure MetaMask is installed and the Tezos snap is enabled.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // For now, we'll use the existing toast service
      this.toastService.showTxErrorToast();
    } finally {
      this.isLoading = false;
    }
  }
}
