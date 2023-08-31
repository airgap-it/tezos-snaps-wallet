import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tx-confirmed-modal',
  templateUrl: './tx-confirmed-modal.component.html',
  styleUrls: ['./tx-confirmed-modal.component.scss'],
})
export class TxConfirmedModalComponent implements OnInit {
  opHash: string = '';

  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
}
