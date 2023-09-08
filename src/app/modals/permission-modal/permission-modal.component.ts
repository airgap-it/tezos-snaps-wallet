import { AppMetadata } from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Account } from 'src/app/services/account.service';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss'],
})
export class PermissionModalComponent implements OnInit {
  public account: Account | undefined;
  public appMetadata: AppMetadata | undefined;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly toastService: ToastrService,
  ) {}

  ngOnInit(): void {}

  confirm(): void {
    this.bsModalRef.onHide?.emit('confirm');
    this.bsModalRef.hide();
    this.toastService.success('Connected to dApp', 'Success', {
      progressBar: true,
      positionClass: 'toast-bottom-center',
    });
  }

  decline(): void {
    this.bsModalRef.onHide?.emit('decline');
    this.bsModalRef.hide();
  }
}
