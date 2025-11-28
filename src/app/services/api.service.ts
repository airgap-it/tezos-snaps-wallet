import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NetworkType } from '@airgap/beacon-types';
import { StorageService } from './storage.service';
import { RpcClient } from '@taquito/rpc';
import { Token } from '../types';
import { DomSanitizer } from '@angular/platform-browser';
import BigNumber from 'bignumber.js';

export type NetworkDisplayType =
  | 'mainnet'
  | 'ghostnet'
  | 'shadownet'
  | 'custom';

export const PREDEFINED_RPCS: Record<
  Exclude<NetworkDisplayType, 'custom'>,
  string
> = {
  mainnet: 'https://blockchain-nodes.papers.tech/tezos/metamask/',
  ghostnet: 'https://rpc.ghostnet.teztnets.com/',
  shadownet: 'https://rpc.shadownet.teztnets.com/',
};

export const PREDEFINED_TZKT_APIS: Record<
  Exclude<NetworkDisplayType, 'custom'>,
  string
> = {
  mainnet: 'https://api.tzkt.io',
  ghostnet: 'https://api.ghostnet.tzkt.io',
  shadownet: 'https://api.shadownet.tzkt.io',
};

export const PREDEFINED_TZKT_EXPLORERS: Record<
  Exclude<NetworkDisplayType, 'custom'>,
  string
> = {
  mainnet: 'https://tzkt.io',
  ghostnet: 'https://ghostnet.tzkt.io',
  shadownet: 'https://shadownet.tzkt.io',
};

type RpcConfig = { selected: string; all: string[] };

const defaultNodes: Partial<Record<NetworkType, RpcConfig>> = {
  [NetworkType.MAINNET]: {
    selected: PREDEFINED_RPCS.mainnet,
    all: [PREDEFINED_RPCS.mainnet],
  },
  [NetworkType.GHOSTNET]: {
    selected: PREDEFINED_RPCS.ghostnet,
    all: [PREDEFINED_RPCS.ghostnet],
  },
  [NetworkType.SHADOWNET]: {
    selected: PREDEFINED_RPCS.shadownet,
    all: [PREDEFINED_RPCS.shadownet],
  },
  [NetworkType.CUSTOM]: {
    selected: '',
    all: [],
  },
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public RPCs: Partial<Record<NetworkType, RpcConfig>> = defaultNodes;

  public currentNetwork: NetworkType = NetworkType.MAINNET;

  public networkDisplayType: NetworkDisplayType = 'mainnet';
  public currentRpcUrl: string = PREDEFINED_RPCS.mainnet;
  public customTzktUrl: string = '';
  public networkLoading: boolean = true;
  public networkLoadError: boolean = false;

  constructor(
    public readonly http: HttpClient,
    private readonly storage: StorageService,
    private domSanitizer: DomSanitizer,
  ) {
    try {
      const parsedNodes = JSON.parse(localStorage.getItem('nodes') ?? '');
      this.RPCs = parsedNodes;
    } catch {}

    // Load custom tzkt URL from localStorage
    this.customTzktUrl = localStorage.getItem('customTzktUrl') ?? '';

    // Load saved network display type and custom RPC URL
    const savedNetworkType = localStorage.getItem(
      'networkDisplayType',
    ) as NetworkDisplayType | null;
    if (savedNetworkType) {
      this.networkDisplayType = savedNetworkType;
    }
    const savedCustomRpcUrl = localStorage.getItem('customRpcUrl');
    if (savedCustomRpcUrl) {
      this.currentRpcUrl = this.normalizeRpcUrl(savedCustomRpcUrl);
    }
  }

  public setCustomTzktUrl(url: string) {
    // Normalize URL to remove trailing slashes
    let normalizedUrl = this.normalizeUrl(url);
    // If user entered API URL (with api. prefix), convert to explorer URL
    normalizedUrl = normalizedUrl.replace('https://api.', 'https://');
    this.customTzktUrl = normalizedUrl;
    localStorage.setItem('customTzktUrl', normalizedUrl);
  }

  public async getPublicKeyForAddress(
    address: string,
  ): Promise<{ network: NetworkType; publicKey: string }> {
    // Try to get the public key from any network
    const RPCs: { network: NetworkType; url: string }[] = Object.entries(
      this.RPCs,
    )
      .filter((element) => !!element[1].selected)
      .map((element) => ({
        network: element[0] as NetworkType,
        url: element[1].selected,
      }));

    // First try to get the public key from the currently selected RPC
    RPCs.unshift({
      network: this.currentNetwork,
      url: this.currentRpcUrl,
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
    address: string,
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

  public setRpcFromSnap(network: NetworkDisplayType, rpcUrl: string) {
    console.log('[setRpcFromSnap] Called with:', { network, rpcUrl });

    // Normalize RPC URL to have trailing slash
    const normalizedRpcUrl = this.normalizeRpcUrl(rpcUrl);

    // Map to underlying NetworkType for RPCs storage (beacon only has MAINNET/GHOSTNET)
    // Shadownet and custom networks use MAINNET as their underlying type
    let networkType: NetworkType;
    switch (network) {
      case 'mainnet':
        networkType = NetworkType.MAINNET;
        break;
      case 'ghostnet':
        networkType = NetworkType.GHOSTNET;
        break;
      case 'shadownet':
        networkType = NetworkType.SHADOWNET;
        break;
      case 'custom':
        networkType = NetworkType.CUSTOM;
        break;
      default:
        networkType = NetworkType.MAINNET;
        break;
    }

    this.currentNetwork = networkType;
    this.currentRpcUrl = normalizedRpcUrl;
    this.networkDisplayType = network;

    // Persist to localStorage
    localStorage.setItem('networkDisplayType', network);
    if (network === 'custom') {
      localStorage.setItem('customRpcUrl', normalizedRpcUrl);
    } else {
      localStorage.removeItem('customRpcUrl');
    }

    console.log(
      '[setRpcFromSnap] Network display type set to:',
      this.networkDisplayType,
    );

    // Initialize RPC config for this network if it doesn't exist
    if (!this.RPCs[networkType]) {
      this.RPCs[networkType] = { selected: '', all: [] };
    }
    if (!this.RPCs[networkType]!.all.includes(normalizedRpcUrl)) {
      this.RPCs[networkType]!.all.push(normalizedRpcUrl);
    }
    this.RPCs[networkType]!.selected = normalizedRpcUrl;

    localStorage.setItem('nodes', JSON.stringify(this.RPCs));
  }

  public setNetworkByDisplayType(
    displayType: NetworkDisplayType,
    customRpcUrl?: string,
  ) {
    if (displayType === 'custom') {
      if (!customRpcUrl) {
        throw new Error('Custom RPC URL is required');
      }
      const normalizedRpcUrl = this.normalizeRpcUrl(customRpcUrl);
      this.currentRpcUrl = normalizedRpcUrl;
      this.networkDisplayType = 'custom';
      // For custom, default to mainnet network type
      this.currentNetwork = NetworkType.MAINNET;
      // Persist custom RPC URL
      localStorage.setItem('customRpcUrl', normalizedRpcUrl);
    } else {
      this.currentRpcUrl = PREDEFINED_RPCS[displayType];
      this.networkDisplayType = displayType;
      // Shadownet uses mainnet network type for tzkt API
      this.currentNetwork =
        displayType === 'ghostnet' ? NetworkType.GHOSTNET : NetworkType.MAINNET;
      // Clear custom RPC URL when switching to predefined network
      localStorage.removeItem('customRpcUrl');
    }

    // Persist network display type
    localStorage.setItem('networkDisplayType', displayType);
  }

  private normalizeUrl(url: string): string {
    // Remove trailing slash for consistent comparison
    return url.replace(/\/+$/, '');
  }

  private normalizeRpcUrl(url: string): string {
    // Ensure RPC URL has trailing slash (consistent with predefined RPCs)
    const trimmed = url.trim();
    return trimmed.endsWith('/') ? trimmed : trimmed + '/';
  }

  private getNetworkDisplayTypeFromRpc(
    rpcUrl: string,
    snapNetwork?: 'mainnet' | 'ghostnet',
  ): NetworkDisplayType {
    const normalizedUrl = this.normalizeUrl(rpcUrl);

    console.log('[getNetworkDisplayTypeFromRpc] Matching URL:', normalizedUrl);
    console.log('[getNetworkDisplayTypeFromRpc] Predefined RPCs:', {
      mainnet: this.normalizeUrl(PREDEFINED_RPCS.mainnet),
      ghostnet: this.normalizeUrl(PREDEFINED_RPCS.ghostnet),
      shadownet: this.normalizeUrl(PREDEFINED_RPCS.shadownet),
    });
    console.log('[getNetworkDisplayTypeFromRpc] Snap network:', snapNetwork);

    // Check if URL matches predefined RPCs (normalize both for comparison)
    if (normalizedUrl === this.normalizeUrl(PREDEFINED_RPCS.shadownet)) {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: shadownet (predefined)',
      );
      return 'shadownet';
    }
    if (normalizedUrl === this.normalizeUrl(PREDEFINED_RPCS.ghostnet)) {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: ghostnet (predefined)',
      );
      return 'ghostnet';
    }
    if (normalizedUrl === this.normalizeUrl(PREDEFINED_RPCS.mainnet)) {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: mainnet (predefined)',
      );
      return 'mainnet';
    }

    // Check URL patterns as fallback
    if (rpcUrl.includes('shadownet')) {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: shadownet (pattern)',
      );
      return 'shadownet';
    }
    if (rpcUrl.includes('ghostnet')) {
      console.log('[getNetworkDisplayTypeFromRpc] Matched: ghostnet (pattern)');
      return 'ghostnet';
    }

    // If snap told us the network, trust it for non-pattern URLs
    if (snapNetwork === 'ghostnet') {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: ghostnet (snap network)',
      );
      return 'ghostnet';
    }
    if (snapNetwork === 'mainnet') {
      console.log(
        '[getNetworkDisplayTypeFromRpc] Matched: mainnet (snap network)',
      );
      return 'mainnet';
    }

    console.log('[getNetworkDisplayTypeFromRpc] No match, returning: custom');
    return 'custom';
  }

  public getCurrentRpc(): string {
    return this.RPCs[this.currentNetwork]?.selected ?? this.currentRpcUrl;
  }

  private getTzktApiBase(): string {
    if (this.networkDisplayType === 'custom' && this.customTzktUrl) {
      // Derive API URL from explorer URL by adding 'api.' prefix
      // e.g., https://tzkt.io -> https://api.tzkt.io
      const explorerUrl = this.normalizeUrl(this.customTzktUrl);
      return explorerUrl.replace('https://', 'https://api.');
    }
    if (this.networkDisplayType !== 'custom') {
      return PREDEFINED_TZKT_APIS[this.networkDisplayType];
    }
    return PREDEFINED_TZKT_APIS.mainnet;
  }

  private getTzktExplorerBase(): string {
    if (this.networkDisplayType === 'custom' && this.customTzktUrl) {
      // Use the explorer URL directly (normalized to remove trailing slash)
      return this.normalizeUrl(this.customTzktUrl);
    }
    if (this.networkDisplayType !== 'custom') {
      return PREDEFINED_TZKT_EXPLORERS[this.networkDisplayType];
    }
    return PREDEFINED_TZKT_EXPLORERS.mainnet;
  }

  public async getBalanceOfAddress(address: string) {
    const client = new RpcClient(this.getCurrentRpc());

    return client.getBalance(address);
  }

  public async getOperationHistory(address: string) {
    const operations = await this.http
      .get<any[]>(
        `${this.getTzktApiBase()}/v1/accounts/${address}/operations?limit=10`,
      )
      .toPromise();

    return operations;
  }

  public async getTokenTransactionHistory(address: string) {
    const operations = await this.http
      .get<any[]>(
        `${this.getTzktApiBase()}/v1/tokens/transfers?anyof.from.to=${address}&sort.desc=id&limit=10`,
      )
      .toPromise();

    return operations;
  }

  public async getBlockexplorerAddressLink(address: string) {
    return `${this.getTzktExplorerBase()}/${address}`;
  }

  public async getTokenBalances(address: string): Promise<Token[]> {
    return this.http
      .get<Token[]>(
        `${this.getTzktApiBase()}/v1/tokens/balances?token.metadata.displayUri.null=true&balance.ne=0&account=${address}&sort.desc=balance&limit=5`,
      )
      .toPromise()
      .then((res) =>
        res.map((item) => {
          item.token.metadata.sanitizedThumbnailUri = item.token.metadata
            .thumbnailUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                item.token.metadata.thumbnailUri?.startsWith('ipfs://')
                  ? `https://ipfs.io/ipfs${item.token.metadata.thumbnailUri.slice(
                      6,
                    )}/`
                  : item.token.metadata.thumbnailUri,
              )
            : undefined;
          item.humanReadableBalance = new BigNumber(item.balance)
            .shiftedBy(-new BigNumber(item.token.metadata.decimals).toNumber())
            .decimalPlaces(6)
            .toString(10);
          return item;
        }),
      );
  }

  public async getNftBalances(address: string): Promise<Token[]> {
    return this.http
      .get<Token[]>(
        `${this.getTzktApiBase()}/v1/tokens/balances?token.standard=fa2&token.metadata.displayUri.null=false&balance.ne=0&account=${address}&limit=20`,
      )
      .toPromise()
      .then((res) =>
        res.map((item) => {
          item.token.metadata.sanitizedThumbnailUri = item.token.metadata
            .displayUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                `https://ipfs.io/ipfs${item.token.metadata.displayUri.slice(
                  6,
                )}/`,
              )
            : item.token.metadata.artifactUri
            ? this.domSanitizer.bypassSecurityTrustUrl(
                `https://ipfs.io/ipfs${item.token.metadata.artifactUri.slice(
                  6,
                )}/`,
              )
            : undefined;
          return item;
        }),
      );
  }

  public async getXtzPrice(): Promise<number> {
    return this.http
      .get<{ USD: number }>(
        `https://min-api.cryptocompare.com/data/price?fsym=XTZ&tsyms=USD`,
      )
      .toPromise()
      .then((res) => res.USD);
  }
}
