import { NetworkType } from '@airgap/beacon-types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export enum StorageKeys {
  ACCOUNTS = 'explorer:accounts',
  REQUEST_ID_PREFIX = 'explorer:req_id_',
  METAMASK_BUSY = 'explorer:metamask_busy',
}

export enum AccountType {
  METAMASK = 'metamask',
}

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

  public hasAccounts: boolean = false;

  constructor(private readonly _storage: StorageService) {
    this.accounts$ = this._accounts$.asObservable();
    const accounts: Account[] = JSON.parse(
      localStorage.getItem(StorageKeys.ACCOUNTS) ?? '[]',
    );

    this._accounts$.next(accounts);

    this.accounts$.subscribe((accounts) => {
      this.hasAccounts = accounts.length > 0;
    });
  }

  async addOrUpdateAccount(account: Account) {
    const accounts = this._accounts$.value;
    if (accounts.every((acc) => acc.address !== account.address)) {
      accounts.push(account);
    }
    localStorage.setItem(StorageKeys.ACCOUNTS, JSON.stringify(accounts));
    this._accounts$.next(accounts);
  }

  async removeAccount(account: Account) {
    const accounts = this._accounts$.value.filter(
      (acc) => acc.address !== account.address,
    );
    localStorage.setItem(StorageKeys.ACCOUNTS, JSON.stringify(accounts));
    this._accounts$.next(accounts);
  }

  async disconnect() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('explorer:')) {
        localStorage.removeItem(key);
      }
    });
    this._accounts$.next([]);
    this.hasAccounts = false;
  }
}
