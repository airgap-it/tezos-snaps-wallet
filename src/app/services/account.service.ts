import { NetworkType } from '@airgap/beacon-types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export enum AccountType {
  WATCH_ONLY = 'watch-only',
  IN_MEMORY = 'in-memory',
  BEACON = 'beacon',
}

// TODO: Convert to class with subclasses for watch-only/beacon/memory
export interface Account {
  address: string;
  publicKey: string;
  type: AccountType;
  description: string;
  tags: string[];
  network: NetworkType;
  wallet: { name: string };
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  public accounts$: Observable<Account[]>;

  private _accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<
    Account[]
  >([]);

  constructor(private readonly _storage: StorageService) {
    this.accounts$ = this._accounts$.asObservable();
    const accounts: Account[] = JSON.parse(
      localStorage.getItem('accounts') ?? '[]'
    );

    this._accounts$.next(accounts);
  }

  async addOrUpdateAccount(account: Account) {
    const accounts = this._accounts$.value;
    if (accounts.every((acc) => acc.address !== account.address)) {
      accounts.push(account);
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    this._accounts$.next(accounts);
  }

  async removeAccount(account: Account) {
    const accounts = this._accounts$.value.filter(
      (acc) => acc.address !== account.address
    );
    localStorage.setItem('accounts', JSON.stringify(accounts));
    this._accounts$.next(accounts);
  }
}
