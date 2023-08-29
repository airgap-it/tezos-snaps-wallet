import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SendTezModalComponent } from 'src/app/components/send-tez-modal/send-tez-modal.component';
import { Token } from 'src/app/types';

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

  constructor(public readonly modalService: BsModalService) {}

  ngOnInit(): void {}

  openLink(link: string) {
    window.open(link, '_blank');
  }

  sendTez() {
    const initialState: ModalOptions<SendTezModalComponent> = {
      initialState: {
        recipient: 'tz1',
        amount: '123',
      },
      class: 'modal-dialog-centered',
    };
    const bsModalRef = this.modalService.show(
      SendTezModalComponent,
      initialState
    );
  }
}
