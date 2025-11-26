import { getMetaMaskProviderAsync } from './snap';

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = await getMetaMaskProviderAsync();

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

export const isMetaMaskInstalled = async (): Promise<boolean> => {
  const provider = await getMetaMaskProviderAsync();
  return Boolean(provider);
};
