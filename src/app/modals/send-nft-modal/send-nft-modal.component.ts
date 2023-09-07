import { TezosOperationType } from '@airgap/beacon-wallet';
import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { BeaconService } from 'src/app/services/beacon.service';
import { sendOperationRequest } from 'src/app/utils/snap';

@Component({
  selector: 'app-send-nft-modal',
  templateUrl: './send-nft-modal.component.html',
  styleUrls: ['./send-nft-modal.component.scss'],
})
export class SendNftModalComponent implements OnInit {
  recipient: string = '';
  amount: string = '';
  tokenId: string = '';

  fromAddress: string = '';
  toAddress: string = '';

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly apiService: ApiService,
    public readonly accountService: AccountService,
    public readonly beaconService: BeaconService,
  ) {}

  ngOnInit(): void {}

  async send() {
    // TODO: This doesn't work yet, need to convert addresses to bytes
    const result = await sendOperationRequest([
      {
        kind: TezosOperationType.TRANSACTION,
        amount: '0',
        destination: this.recipient,
        parameters: {
          entrypoint: 'transfer',
          value: [
            {
              prim: 'Pair',
              args: [
                {
                  bytes: this.fromAddress,
                },
                [
                  {
                    prim: 'Pair',
                    args: [
                      {
                        bytes: this.toAddress,
                      },
                      {
                        prim: 'Pair',
                        args: [
                          {
                            int: this.tokenId,
                          },
                          {
                            int: this.amount,
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      },
    ]);

    console.log('RESULT', result);
    this.bsModalRef.hide();
  }

  onAmountChanged(amount: string) {
    this.amount = amount;
  }
}
