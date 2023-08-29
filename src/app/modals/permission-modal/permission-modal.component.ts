import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Account } from 'src/app/services/account.service';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss'],
})
export class PermissionModalComponent implements OnInit {
  public account: Account | undefined;

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
