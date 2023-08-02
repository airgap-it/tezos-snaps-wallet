import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sign-payload-modal',
  templateUrl: './sign-payload-modal.component.html',
  styleUrls: ['./sign-payload-modal.component.scss'],
})
export class SignPayloadModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm(): void {
    this.bsModalRef.onHide?.emit('confirm');
    this.bsModalRef.hide();
  }

  decline(): void {
    this.bsModalRef.onHide?.emit('decline');
    this.bsModalRef.hide();
  }
}
