import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Account, AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-accounts-overview',
  templateUrl: './accounts-overview.component.html',
  styleUrls: ['./accounts-overview.component.scss'],
})
export class AccountsOverviewComponent implements OnInit {
  title?: string;
  closeBtnName?: string;
  list: any[] = [];

  address: string = '';

  accounts$: Observable<Account[]>;

  constructor(
    private readonly accountService: AccountService,
    public readonly bsModalRef: BsModalRef,
  ) {
    this.accounts$ = this.accountService.accounts$;
  }

  ngOnInit(): void {}
}
