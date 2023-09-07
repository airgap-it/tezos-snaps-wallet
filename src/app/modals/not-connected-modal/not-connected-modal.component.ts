import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MetamaskService } from 'src/app/services/metamask.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-not-connected-modal',
  templateUrl: './not-connected-modal.component.html',
  styleUrls: ['./not-connected-modal.component.scss'],
})
export class NotConnectedModalComponent implements OnInit {
  public successCallback?: () => void;
  public errorCallback?: () => void;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly modalService: ModalService,
    private readonly metamaskService: MetamaskService,
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.bsModalRef.hide();
  }

  async connect() {
    this.bsModalRef.hide();
    const bsModalRef = this.showLoadingModal();
    this.metamaskService
      .connect()
      .then(() => {
        bsModalRef.hide();
        if (this.successCallback) {
          this.successCallback();
        }
      })
      .catch(async () => {
        bsModalRef.hide();
        if (this.errorCallback) {
          this.errorCallback();
        }
      });
  }

  showLoadingModal() {
    return this.modalService.showLoadingModal('Connecting...');
  }
}
