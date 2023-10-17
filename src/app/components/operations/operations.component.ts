import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { fadeIn } from 'src/app/animations/fade-in.animation';
import { AccountService } from 'src/app/services/account.service';
import { ClipboardService } from 'src/app/services/clipboard.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  animations: [fadeIn],
})
export class OperationsComponent implements OnInit {
  @Input() operations: {
    type: 'transaction' | string;
    hash: string;
    amount: number;
    sender: { address: string };
    target: { address: string };
    from?: { address: string };
    to?: { address: string };
    timestamp: string;
    formattedAmount?: string;
    transactionId?: string;
    token?: { metadata: { name: string; decimals: number } };
  }[] = [];

  @Input() isLoading: boolean = true;
  address: string = '';

  constructor(
    private readonly accountService: AccountService,
    private readonly clipboardService: ClipboardService,
  ) {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        this.address = accounts[0].address;
      }
    });
  }

  ngOnInit(): void {}

  openLink(link: string) {
    window.open(link, '_blank');
  }

  copyAddressToClipboard(ev: MouseEvent, address: string) {
    ev.stopPropagation();
    this.clipboardService.copy(address);
  }
}
