/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

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

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window.ethereum !== 'undefined') {
    return (
      window.ethereum.isMetaMask && !(window.ethereum as any).isBraveWallet
    );
  }
  return false;
};
