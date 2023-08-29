import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {
  title?: string;
  qrData: string = '';
  closeBtnName?: string;

  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
}
