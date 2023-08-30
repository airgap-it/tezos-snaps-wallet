import { TezosOperationType } from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
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

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly accountService: AccountService,
    public readonly beaconService: BeaconService
  ) {}

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
}
