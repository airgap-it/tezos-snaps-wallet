import BigNumber from 'bignumber.js';
import { TezosOperation, TezosOperationType } from './types';
import {
  REVEAL_FEE_LIMIT,
  REVEAL_GAS_LIMIT,
  REVEAL_STORAGE_LIMIT,
} from './constants';

export const createRevealOperation = async (
  counter: BigNumber,
  publicKey: string,
  address: string,
  fee: string = new BigNumber(REVEAL_FEE_LIMIT).toFixed(),
): Promise<TezosOperation> => {
  const operation = {
    kind: TezosOperationType.REVEAL,
    fee,
    gas_limit: REVEAL_GAS_LIMIT,
    storage_limit: REVEAL_STORAGE_LIMIT,
    counter: counter.toFixed(),
    public_key: publicKey,
    source: address,
  };

  return operation;
};
