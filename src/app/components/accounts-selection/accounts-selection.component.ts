import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountService,
  AccountType,
} from 'src/app/services/account.service';

import { NetworkType } from '@airgap/beacon-types';

@Component({
  selector: 'app-accounts-selection',
  templateUrl: './accounts-selection.component.html',
  styleUrls: ['./accounts-selection.component.scss'],
})
export class AccountsSelectionComponent implements OnInit {
  accounts$: Observable<Account[]> | undefined;

  public network: NetworkType | undefined;

  constructor(
    public bsModalRef: BsModalRef,
    private readonly accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accountService.accounts$.pipe(
      map((accounts) => {
        return accounts.filter((account) => {
          if (
            account.type === AccountType.BEACON &&
            this.network &&
            account.network === this.network
          ) {
            return false;
          }

          return true;
        });
      })
    );
  }

  close(): void {
    this.bsModalRef.hide();
  }

  select(account: Account) {
    this.bsModalRef.onHide?.emit({ isAccount: true, account });
    this.close();
  }
}
