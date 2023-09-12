import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AccountComponent implements OnChanges {
  @Input() address: string = '';
  @Input() balance: string = '';
  @Input() usdBalance: string = '';
  @Input() tokens: Token[] = [];

  @Input() isLoading: boolean = true;

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
