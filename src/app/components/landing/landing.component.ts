import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TextModalComponent } from '../../modals/text-modal/text-modal.component';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(
    public readonly metamaskService: MetamaskService,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  async connect() {
    const bsModalRef = this.showLoadingModal();
    this.metamaskService.connect().finally(() => {
      bsModalRef.hide();
    });
  }

  showLoadingModal(): BsModalRef<LoadingModalComponent> {
    const initialState: ModalOptions<LoadingModalComponent> = {
      initialState: {
        text: 'Connecting...',
      },
    };
    const bsModalRef = this.modalService.show(
      LoadingModalComponent,
      initialState
    );
    return bsModalRef;
  }

  showModal(type: 'instructions'): void {
    const initialState: ModalOptions<TextModalComponent> = {
      initialState: {
        title: 'header',
        text: type,
        closeBtnName: 'Close',
      },
    };
    const bsModalRef = this.modalService.show(TextModalComponent, initialState);
  }
}
