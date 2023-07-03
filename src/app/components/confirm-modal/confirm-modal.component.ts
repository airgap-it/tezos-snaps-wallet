import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  close(): void {
    this.bsModalRef.hide();
  }

  confirm(): void {
    this.bsModalRef.onHide?.emit('confirm');
    this.bsModalRef.hide();
  }

  decline(): void {
    this.bsModalRef.onHide?.emit('decline');
    this.bsModalRef.hide();
  }
}
