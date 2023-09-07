import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';

@Component({
  selector: 'app-confirm-tx-modal',
  templateUrl: './confirm-tx-modal.component.html',
  styleUrls: ['./confirm-tx-modal.component.scss'],
})
export class ConfirmTxModalComponent implements OnInit {
  recipient: string = '';
  amount: string = '';
  usdAmount: string = '0.00';
  usdPrice: number = 0;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly apiService: ApiService,
    public readonly accountService: AccountService,
    public readonly beaconService: BeaconService,
  ) {
    this.apiService.getXtzPrice().then((price) => {
      this.usdPrice = price;
      this.usdAmount = new BigNumber(this.amount)
        .times(this.usdPrice)
        .toString(10);
    });
  }

  ngOnInit(): void {}

  async confirm() {
    this.bsModalRef.hide();
  }
}
