import { TezosOperationType } from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';
import { sendOperationRequest } from 'src/app/utils/snap';

@Component({
  selector: 'app-send-tez-modal',
  templateUrl: './send-tez-modal.component.html',
  styleUrls: ['./send-tez-modal.component.scss'],
})
export class SendTezModalComponent implements OnInit {
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
    this.apiService.getXtzPrice().then((price) => (this.usdPrice = price));
  }

  ngOnInit(): void {}

  async send() {
    const result = await sendOperationRequest([
      {
        kind: TezosOperationType.TRANSACTION,
        amount: this.amount,
        destination: this.recipient,
      },
    ]);

    console.log('RESULT', result);
    this.bsModalRef.hide();
  }

  onAmountChanged(amount: string) {
    this.amount = amount;
    this.usdAmount = new BigNumber(amount).times(this.usdPrice).toString(10);
  }
}
