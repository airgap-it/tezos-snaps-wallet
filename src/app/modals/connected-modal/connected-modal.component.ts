import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { BeaconService } from 'src/app/services/beacon.service';

@Component({
  selector: 'app-connected-modal',
  templateUrl: './connected-modal.component.html',
  styleUrls: ['./connected-modal.component.scss'],
})
export class ConnectedModalComponent implements OnInit {
  closeBtnName?: string;

  address: string = '';

  constructor(
    public readonly bsModalRef: BsModalRef,
    private readonly accountService: AccountService,
    private readonly beaconService: BeaconService,
  ) {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        this.address = accounts[0].address;
      }
    });
  }

  ngOnInit(): void {}

  close(): void {
    this.bsModalRef.hide();
    this.beaconService.handlePendingRequest();
  }
}
