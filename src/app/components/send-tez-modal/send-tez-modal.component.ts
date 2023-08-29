import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-send-tez-modal',
  templateUrl: './send-tez-modal.component.html',
  styleUrls: ['./send-tez-modal.component.scss'],
})
export class SendTezModalComponent implements OnInit {
  recipient: string = '';
  amount: string = '';

  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
}
