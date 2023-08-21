import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NetworkType } from '@airgap/beacon-types';
import { StorageService } from './storage.service';
import { RpcClient } from '@taquito/rpc';
import { Token } from '../types';
import { DomSanitizer } from '@angular/platform-browser';
import BigNumber from 'bignumber.js';

const defaultNodes = {
  [NetworkType.MAINNET]: {
    selected: 'https://mainnet.api.tez.ie',
    all: [
      'https://mainnet.api.tez.ie',
      'https://mainnet.smartpy.io',
      'https://rpc.tzbeta.net',
      'https://teznode.letzbake.com',
      'https://mainnet-tezos.giganode.io',
    ],
  },
  [NetworkType.GHOSTNET]: {
    selected: 'https://tezos-ghostnet-node-1.diamond.papers.tech',
    all: ['https://tezos-ghostnet-node-1.diamond.papers.tech'],
  },
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public RPCs: {
    [NetworkType.MAINNET]: { selected: string; all: string[] };
    [NetworkType.GHOSTNET]: { selected: string; all: string[] };
  } = defaultNodes;

  constructor(
    public readonly http: HttpClient,
    private readonly storage: StorageService,
    private domSanitizer: DomSanitizer
  ) {
    try {
      const parsedNodes = JSON.parse(localStorage.getItem('nodes') ?? '');
      this.RPCs = parsedNodes;
    } catch {}
  }

  public async getPublicKeyForAddress(
    address: string
  ): Promise<{ network: NetworkType; publicKey: string }> {
    // Try to get the public key from any network
    const RPCs: { network: NetworkType; url: string }[] = Object.entries(
      this.RPCs
    )
      .filter((element) => !!element[1].selected)
      .map((element) => ({
        network: element[0] as NetworkType,
        url: element[1].selected,
      }));

    // First try to get the public key from the selected RPC
    RPCs.unshift({
      network: NetworkType.MAINNET,
      url: this.RPCs.mainnet.selected,
    });

    for (let rpc of RPCs) {
      const result = await this.getPublicKeyForAddressFromRPC(rpc.url, address);

      if (result) {
        return { network: rpc.network, publicKey: result };
      }
    }

    throw new Error('No entry found');
  }

  private async getPublicKeyForAddressFromRPC(
    rpc: string,
    address: string
  ): Promise<string | null> {
    const url = `${rpc}/chains/main/blocks/head/context/contracts/${address}/manager_key`;
    const response = await this.http.get<string | null>(url).toPromise();
    console.log(response);
    return response;
  }

  public async selectRpc(network: NetworkType, rpc: string) {
    (this.RPCs as any)[network].selected = rpc;

    localStorage.setItem('nodes', JSON.stringify(this.RPCs));
  }

  public async addCustomRpc(network: NetworkType, rpc: string) {
    (this.RPCs as any)[network].all.push(rpc);

    this.selectRpc(network, rpc);
  }

  public async getBalanceOfAddress(address: string) {
    const client = new RpcClient(this.RPCs['mainnet'].selected);

    return client.getBalance(address);
  }

  public async getTransactionHistory(address: string) {
    // https://api.mainnet.tzkt.io/
    // https://api.ghostnet.tzkt.io/
    const operations = await this.http
      .get(`https://api.tzkt.io/v1/accounts/${address}/operations`)
      .toPromise();

    return operations;
  }

  public async getBlockexplorerAddressLink(address: string) {
    return `https://tzkt.io/${address}`;
  }

  public async getTokenBalances(address: string): Promise<Token[]> {
    return this.http
      .get<Token[]>(
        `https://api.tzkt.io/v1/tokens/balances?token.metadata.displayUri.null=true&balance.ne=0&account=${address}&sort.desc=balance`
      )
      .toPromise()
      .then((res) =>
        res.map((item) => {
          item.token.metadata.sanitizedThumbnailUri = item.token.metadata
            .thumbnailUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                `https://cloudflare-ipfs.com/ipfs/${item.token.metadata.thumbnailUri.slice(
                  6
                )}/`
              )
            : undefined;
          item.humanReadableBalance = new BigNumber(item.balance)
            .shiftedBy(-new BigNumber(item.token.metadata.decimals).toNumber())
            .toString(10);
          return item;
        })
      );
  }

  public async getNftBalances(address: string): Promise<Token[]> {
    return this.http
      .get<Token[]>(
        `https://api.tzkt.io/v1/tokens/balances?token.standard=fa2&token.metadata.displayUri.null=false&account=${address}&limit=20`
      )
      .toPromise()
      .then((res) =>
        res.map((item) => {
          item.token.metadata.sanitizedThumbnailUri = item.token.metadata
            .displayUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                `https://cloudflare-ipfs.com/ipfs/${item.token.metadata.displayUri.slice(
                  6
                )}/`
              )
            : item.token.metadata.artifactUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                `https://cloudflare-ipfs.com/ipfs/${item.token.metadata.artifactUri.slice(
                  6
                )}/`
              )
            : undefined;
          return item;
        })
      );
  }

  public async getXtzPrice(): Promise<number> {
    return this.http
      .get<{ USD: number }>(
        `https://min-api.cryptocompare.com/data/price?fsym=XTZ&tsyms=USD`
      )
      .toPromise()
      .then((res) => res.USD);
  }
}
