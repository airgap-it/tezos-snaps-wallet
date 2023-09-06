import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnChanges {
  @Input() address: string = '';
  @Input() balance: string = '';
  @Input() usdBalance: string = '';
  @Input() tokens: Token[] = [];

  tezMainAmount: string = '0';
  tezDecimalAmount: string = '0';

  constructor(public readonly modalService: ModalService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const balance: string = changes.balance?.currentValue;
    if (balance) {
      [this.tezMainAmount, this.tezDecimalAmount] = balance.split('.');
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  sendTez() {
    this.modalService.showSendTezModal();
  }
}
