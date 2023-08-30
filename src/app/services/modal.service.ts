import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LoadingModalComponent } from '../modals/loading-modal/loading-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { NodeSelectorModalComponent } from '../modals/node-selector-modal/node-selector-modal.component';
import { HowToModalComponent } from '../modals/how-to-modal/how-to-modal.component';
import { NoAccountModalComponent } from '../modals/no-account-modal/no-account-modal.component';
import { Account } from './account.service';
import { PermissionModalComponent } from '../modals/permission-modal/permission-modal.component';
import { OperationModalComponent } from '../modals/operation-modal/operation-modal.component';
import { Network } from '@airgap/beacon-wallet';
import { SignPayloadModalComponent } from '../modals/sign-payload-modal/sign-payload-modal.component';
import { SendTezModalComponent } from '../modals/send-tez-modal/send-tez-modal.component';
import { TextModalComponent } from '../modals/text-modal/text-modal.component';
import { QrModalComponent } from '../modals/qr-modal/qr-modal.component';

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
      initialState
    );
    return bsModalRef;
  }

  showConfirmModal() {
    const initialState: ModalOptions<LoadingModalComponent> = {
      ...this.modalOptions,
    };

    const bsModalRef = this.modalService.show(
      ConfirmModalComponent,
      initialState
    );

    return bsModalRef;
  }

  openNodeSelectorModal() {
    const initialState: ModalOptions<NodeSelectorModalComponent> = {
      ...this.modalOptions,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      NodeSelectorModalComponent,
      initialState
    );

    return bsModalRef;
  }

  openHowToModal() {
    const initialState: ModalOptions<HowToModalComponent> = {
      ...this.modalOptions,
      initialState: {
        closeBtnName: 'Close',
      },
    };

    const bsModalRef = this.modalService.show(
      HowToModalComponent,
      initialState
    );

    return bsModalRef;
  }

  showNoAccountModal() {
    const initialState: ModalOptions<NoAccountModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
    };

    const bsModalRef = this.modalService.show(
      NoAccountModalComponent,
      initialState
    );

    return bsModalRef;
  }

  showPermissionModal(account: Account) {
    const initialState: ModalOptions<PermissionModalComponent> = {
      ...this.modalOptions,
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        account,
      },
    };

    const bsModalRef = this.modalService.show(
      PermissionModalComponent,
      initialState
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
          console.log('xxxxxxx');
        },
      },
    };

    const bsModalRef = this.modalService.show(
      OperationModalComponent,
      initialState
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
      initialState
    );

    return bsModalRef;
  }

  showSendTezModal() {
    const initialState: ModalOptions<SendTezModalComponent> = {
      ...this.modalOptions,
      initialState: {
        recipient: 'tz1',
        amount: '123',
      },
      class: 'modal-dialog-centered',
    };

    const bsModalRef = this.modalService.show(
      SendTezModalComponent,
      initialState
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
  }

  showConfirmCallbackModal(confirmCallback: () => void) {
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
      initialState
    );
  }

  showInstructionsModal() {
    const initialState: ModalOptions<TextModalComponent> = {
      ...this.modalOptions,
      initialState: {
        title: 'header',
        text: 'text',
        closeBtnName: 'Close',
      },
    };
    const bsModalRef = this.modalService.show(TextModalComponent, initialState);
  }
}
