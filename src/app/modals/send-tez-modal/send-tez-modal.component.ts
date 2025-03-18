import {
  NetworkType,
  PartialTezosTransactionOperation,
  TezosOperationType,
  TezosTransactionOperation,
} from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';
import { ToastService } from 'src/app/services/toast.service';
import { sendOperationRequest } from 'src/app/utils/snap';
import { prepareOperations } from 'src/app/utils/tezos/prepare-operations';

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
  fee?: string;

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly apiService: ApiService,
    public readonly accountService: AccountService,
    public readonly beaconService: BeaconService,
    public readonly toastService: ToastService,
  ) {
    this.apiService.getXtzPrice().then((price) => (this.usdPrice = price));
  }

  ngOnInit(): void {}

  async send() {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      const account = accounts[0];
      const operations: PartialTezosTransactionOperation[] = [
        {
          kind: TezosOperationType.TRANSACTION,
          amount: new BigNumber(this.amount).times(1_000_000).toString(),
          destination: this.recipient,
        },
      ];

      try {
        const estimated = await prepareOperations(
          account.address,
          account.publicKey,
          operations,
          (this.apiService.RPCs as any)[NetworkType.MAINNET].selected + '/',
        );

        this.fee = new BigNumber(
          (estimated.contents[0] as TezosTransactionOperation).fee,
        )
          .div(1_000_000)
          .toString();

        const result = await sendOperationRequest(operations);
        this.toastService.showTxSuccessToast();

        console.log('RESULT', result);
      } catch (e) {
        console.error('Error sending operation', e);
        this.toastService.showTxErrorToast();
      }
      this.bsModalRef.hide();
    });
  }

  onAmountChanged(amount: string) {
    this.amount = amount;
    this.usdAmount = new BigNumber(amount).times(this.usdPrice).toString(10);
  }
}
