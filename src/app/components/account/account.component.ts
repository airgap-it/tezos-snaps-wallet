import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() address: string = '';
  @Input() balance: string = '';
  @Input() usdBalance: string = '';
  @Input() tokens: Token[] = [];

  constructor(public readonly modalService: ModalService) {}

  ngOnInit(): void {}

  openLink(link: string) {
    window.open(link, '_blank');
  }

  sendTez() {
    this.modalService.showSendTezModal();
  }
}
