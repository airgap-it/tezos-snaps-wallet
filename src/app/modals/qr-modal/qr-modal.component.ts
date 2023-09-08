import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'src/app/services/clipboard.service';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {
  title?: string;
  qrData: string = '';
  closeBtnName?: string;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly clipboardService: ClipboardService,
  ) {}

  ngOnInit(): void {}

  copyToClipboard() {
    this.clipboardService.copy(this.qrData);
  }
}
