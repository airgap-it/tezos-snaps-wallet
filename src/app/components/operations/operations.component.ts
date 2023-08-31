import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  @Input() operations: {
    hash: string;
    amount: number;
    sender: { address: string };
    target: { address: string };
    timestamp: string;
  }[] = [];

  address: string = '';

  constructor(private readonly accountService: AccountService) {
    this.accountService.accounts$.pipe(first()).subscribe(async (accounts) => {
      if (accounts[0]) {
        this.address = accounts[0].address;
      }
    });
  }

  ngOnInit(): void {}
}
