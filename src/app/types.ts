import { SafeUrl } from '@angular/platform-browser';

export interface Token {
  id: number;
  account: Account;
  token: Token;
  balance: string;
  humanReadableBalance?: string;
  transfersCount: number;
  firstLevel: number;
  firstTime: string;
  lastLevel: number;
  lastTime: string;
}

export interface Account {
  alias: string;
  address: string;
}

export interface Token {
  id: number;
  contract: Contract;
  tokenId: string;
  standard: string;
  totalSupply: string;
  metadata: Metadata;
}

export interface Contract {
  alias?: string;
  address: string;
}

export interface Metadata {
  name?: string;
  symbol: string;
  decimals: string;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
  rarity?: string;
  token_id?: string;
  thumbnailUri?: string;
  artifactUri?: string;
  sanitizedThumbnailUri?: SafeUrl;
  v?: string;
  shouldPreferSymbol: any;
  description?: string;
  eth_name?: string;
  eth_symbol?: string;
  eth_contract?: string;
  domainData?: DomainData;
  isBooleanAmount?: boolean;
  displayUri?: string;
  is_transferable: any;
  is_boolean_amount: any;
  should_prefer_symbol: any;
  thumbnail_uri?: string;
  isTransferable?: boolean;
}

export interface DomainData {}
