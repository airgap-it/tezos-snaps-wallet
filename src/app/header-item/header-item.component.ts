import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { MetamaskService } from '../services/metamask.service';
import { AccountService } from '../services/account.service';
import { QrModalComponent } from '../qr-modal/qr-modal.component';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss'],
})
export class HeaderItemComponent implements OnInit {
  address: string = '';

  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly accountService: AccountService,
    public readonly modalService: BsModalService
  ) {
    this.loadAccountInfo();
  }

  ngOnInit(): void {}

  loadAccountInfo() {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        this.address = accounts[0].address;
        console.log('ASDLKASDLAKSDLKASD ', this.address);
      }
    });
  }

  showQrModal() {
    const initialState: ModalOptions<QrModalComponent> = {
      initialState: {
        title: 'Your Account QR Code',
        qrData: this.address,
      },
      class: 'modal-dialog-centered',
    };
    const bsModalRef = this.modalService.show(QrModalComponent, initialState);
  }
}
