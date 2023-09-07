import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { MetamaskService } from '../../services/metamask.service';
import { AccountService } from '../../services/account.service';
import { ModalService } from 'src/app/services/modal.service';
import { ClipboardService } from 'src/app/services/clipboard.service';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss'],
})
export class HeaderItemComponent implements OnInit {
  address: string = '';
  network: string = 'Mainnet';
  otherNetwork: string = 'Ghostnet';

  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly accountService: AccountService,
    public readonly modalService: ModalService,
    public readonly clipboardService: ClipboardService,
  ) {
    this.loadAccountInfo();
  }

  ngOnInit(): void {}

  loadAccountInfo() {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        this.address = accounts[0].address;
      }
    });
  }

  showQrModal() {
    this.modalService.showQRModal(this.address);
  }

  disconnect() {
    this.modalService.showConfirmModal(() => {
      this.accountService.hasAccounts
        ? this.accountService.disconnect()
        : this.metamaskService.connect();
    });
  }

  changeNetwork() {
    if (this.network === 'Mainnet') {
      this.network = 'Ghostnet';
      this.otherNetwork = 'Mainnet';
    } else {
      this.network = 'Mainnet';
      this.otherNetwork = 'Ghostnet';
    }
  }

  copyToClipboard() {
    this.clipboardService.copy(this.address);
  }
}
