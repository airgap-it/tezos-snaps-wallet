import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LoadingModalComponent } from '../modals/loading-modal/loading-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { NodeSelectorModalComponent } from '../modals/node-selector-modal/node-selector-modal.component';
import { HowToModalComponent } from '../modals/how-to-modal/how-to-modal.component';
import { NotConnectedModalComponent } from '../modals/not-connected-modal/not-connected-modal.component';
import { Account } from './account.service';
import { PermissionModalComponent } from '../modals/permission-modal/permission-modal.component';
import { OperationModalComponent } from '../modals/operation-modal/operation-modal.component';
import { SignPayloadModalComponent } from '../modals/sign-payload-modal/sign-payload-modal.component';
import { SendTezModalComponent } from '../modals/send-tez-modal/send-tez-modal.component';
import { TextModalComponent } from '../modals/text-modal/text-modal.component';
import { QrModalComponent } from '../modals/qr-modal/qr-modal.component';
import { Token } from '../types';
import { ConnectedModalComponent } from '../modals/connected-modal/connected-modal.component';
import { AppMetadata } from '@airgap/beacon-wallet';
import { NftModalComponent } from '../modals/nft-modal/nft-modal.component';
import { SendTokenModalComponent } from '../modals/send-token-modal/send-token-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalOptions: ModalOptions = {
    class: 'modal-dialog-centered',
  };

  constructor(private readonly modalService: BsModalService) {}

  showLoadingModal(text: string = 'Loading...') {
    const initialState: ModalOptions<LoadingModalComponent> = {
      ...this.modalOptions,
      initialState: {
        text,
      },
    };

    const bsModalRef = this.modalService.show(
      LoadingModalComponent,
      initialState,
    );
    return bsModalRef;
  }

  showNodeSelectorModal() {
    const initialState: ModalOptions<NodeSelectorModalComponent> = {
      ...this.modalOptions,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      NodeSelectorModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showHowToModal() {
    const initialState: ModalOptions<HowToModalComponent> = {
      ...this.modalOptions,
      initialState: {
        closeBtnName: 'Close',
      },
    };

    const bsModalRef = this.modalService.show(
      HowToModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showNoAccountModal() {
    const initialState: ModalOptions<NotConnectedModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      NotConnectedModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showPermissionModal(account: Account, appMetadata: AppMetadata) {
    const initialState: ModalOptions<PermissionModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        account,
        appMetadata,
      },
    };

    const bsModalRef = this.modalService.show(
      PermissionModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showOperationModal() {
    const initialState: ModalOptions<OperationModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        callback: () => {
          console.log('callback');
        },
      },
    };

    const bsModalRef = this.modalService.show(
      OperationModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showSignModal() {
    const initialState: ModalOptions<SignPayloadModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      SignPayloadModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showSendTezModal() {
    const initialState: ModalOptions<SendTezModalComponent> = {
      ...this.modalOptions,
      initialState: {
        recipient: '',
        amount: '',
      },
    };

    const bsModalRef = this.modalService.show(
      SendTezModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showSendTokenModal(token: Token) {
    const initialState: ModalOptions<SendTokenModalComponent> = {
      ...this.modalOptions,
      initialState: {
        token,
        recipient: '',
        amount: '',
      },
    };

    const bsModalRef = this.modalService.show(
      SendTokenModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showXModal() {
    const initialState: ModalOptions<TextModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'header',
        text: 'text',
        closeBtnName: 'Close',
      },
    };

    const bsModalRef = this.modalService.show(TextModalComponent, initialState);

    return bsModalRef;
  }

  showQRModal(data: string) {
    const initialState: ModalOptions<QrModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'Your Account QR Code',
        qrData: data,
      },
    };
    const bsModalRef = this.modalService.show(QrModalComponent, initialState);

    return bsModalRef;
  }

  showConfirmModal(confirmCallback: () => void) {
    const initialState: ModalOptions<ConfirmModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'Disconnect',
        text: 'Are you sure you want to disconnet from MetaMask?',
        confirmCallback,
      },
    };

    const bsModalRef = this.modalService.show(
      ConfirmModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showInstructionsModal() {
    const initialState: ModalOptions<TextModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'Installation Instructions',
        text: `<ol>
        <li>To get started make sure you have MetaMask chrome extension installed and then go to the Tezos Wallet powered by Metamask here.</li>
        <li>Connect with MetaMask</li>
        <li>Accept the connection in MetaMask</li>
        <li>Approve and install the Tezos snap</li>
        </ol>`,
      },
    };
    const bsModalRef = this.modalService.show(TextModalComponent, initialState);

    return bsModalRef;
  }

  showNFTModal(nft: Token) {
    const initialState: ModalOptions<NftModalComponent> = {
      ...this.modalOptions,
      class: 'modal-lg',
      initialState: {
        nft,
      },
    };
    const bsModalRef = this.modalService.show(NftModalComponent, initialState);

    return bsModalRef;
  }

  showFaqModal() {
    const initialState: ModalOptions<TextModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'FAQ',
        text: 'text',
      },
    };
    const bsModalRef = this.modalService.show(TextModalComponent, initialState);

    return bsModalRef;
  }

  showNotConnectedModal(
    successCallback: () => void,
    errorCallback: () => void,
  ) {
    const initialState: ModalOptions<NotConnectedModalComponent> = {
      ...this.modalOptions,
      initialState: {
        successCallback,
        errorCallback,
      },
    };
    const bsModalRef = this.modalService.show(
      NotConnectedModalComponent,
      initialState,
    );

    return bsModalRef;
  }

  showConnectedModal() {
    const initialState: ModalOptions<TextModalComponent> = {
      ...this.modalOptions,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      ConnectedModalComponent,
      initialState,
    );

    return bsModalRef;
  }
}
