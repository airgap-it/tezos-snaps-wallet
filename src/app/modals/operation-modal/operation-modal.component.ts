import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-operation-modal',
  templateUrl: './operation-modal.component.html',
  styleUrls: ['./operation-modal.component.scss'],
})
export class OperationModalComponent implements OnInit {
  public callback: (() => void) | undefined;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  test() {
    if (this.callback) {
      this.callback();
    }
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
