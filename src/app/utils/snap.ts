import { PartialTezosOperation } from '@airgap/beacon-wallet';

/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  /* process.env.REACT_APP_SNAP_ORIGIN */ `npm:tezos-metamask-snap` ??
  `local:http://localhost:8080`;

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};

// Cache for EIP-6963 discovered providers
let cachedMetaMaskProvider: any = null;
let eip6963Initialized = false;

/**
 * Initialize EIP-6963 provider discovery.
 * This is the modern standard for wallet discovery that avoids provider conflicts.
 */
const initEIP6963 = (): Promise<void> => {
  if (eip6963Initialized) return Promise.resolve();

  return new Promise((resolve) => {
    const handleAnnouncement = (event: any) => {
      const { info, provider } = event.detail || {};
      console.log('[EIP-6963] Provider announced:', info?.name, info?.rdns);

      // Look for MetaMask specifically
      if (
        info?.rdns === 'io.metamask' ||
        info?.name?.toLowerCase().includes('metamask')
      ) {
        console.log('[EIP-6963] Found MetaMask provider!');
        cachedMetaMaskProvider = provider;
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnouncement);

    // Request providers to announce themselves
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    eip6963Initialized = true;

    // Give wallets a moment to respond, then resolve
    setTimeout(resolve, 100);
  });
};

/**
 * Get the MetaMask provider directly.
 * This is needed because other wallets may overwrite window.ethereum.
 */
const getMetaMaskProvider = (): any => {
  // First, check if we found MetaMask via EIP-6963
  if (cachedMetaMaskProvider) {
    return cachedMetaMaskProvider;
  }

  const ethereum = window.ethereum as any;
  console.log('[getMetaMaskProvider] window.ethereum:', ethereum);
  console.log('[getMetaMaskProvider] isMetaMask:', ethereum?.isMetaMask);
  console.log('[getMetaMaskProvider] isBraveWallet:', ethereum?.isBraveWallet);
  console.log(
    '[getMetaMaskProvider] isTempleWallet:',
    ethereum?.isTempleWallet,
  );
  console.log('[getMetaMaskProvider] providers:', ethereum?.providers);
  console.log('[getMetaMaskProvider] providerMap:', ethereum?.providerMap);

  if (!ethereum) {
    console.error('[getMetaMaskProvider] No ethereum provider found');
    throw new Error('MetaMask not installed');
  }

  // Check providerMap (some setups use this)
  if (ethereum.providerMap?.size) {
    console.log('[getMetaMaskProvider] Found providerMap');
    const mmProvider = ethereum.providerMap.get('MetaMask');
    if (mmProvider) {
      console.log('[getMetaMaskProvider] Found MetaMask in providerMap');
      return mmProvider;
    }
  }

  // If there are multiple providers (e.g., MetaMask + other wallets),
  // find the MetaMask one specifically
  if (ethereum.providers?.length) {
    console.log(
      '[getMetaMaskProvider] Multiple providers detected:',
      ethereum.providers.length,
    );
    ethereum.providers.forEach((p: any, i: number) => {
      console.log(`[getMetaMaskProvider] Provider ${i}:`, {
        isMetaMask: p.isMetaMask,
        isBraveWallet: p.isBraveWallet,
        constructor: p.constructor?.name,
      });
    });

    const metamaskProvider = ethereum.providers.find(
      (p: any) => p.isMetaMask && !p.isBraveWallet && !p.isTempleWallet,
    );
    if (metamaskProvider) {
      console.log('[getMetaMaskProvider] Found MetaMask in providers array');
      return metamaskProvider;
    }
  }

  // Fallback to whatever is available
  console.warn(
    '[getMetaMaskProvider] Falling back to default ethereum provider - THIS MAY NOT WORK',
  );
  return ethereum;
};

/**
 * Get MetaMask provider, initializing EIP-6963 discovery first if needed.
 */
export const getMetaMaskProviderAsync = async (): Promise<any> => {
  await initEIP6963();
  return getMetaMaskProvider();
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  const provider = await getMetaMaskProviderAsync();
  return (await provider.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  const provider = await getMetaMaskProviderAsync();
  await provider.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const sendGetAccount = async () => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_getAccount',
      },
    },
  });

  console.log('tezos_getAccount', result);

  const publicKey: string = (result as any)?.publicKey;
  const address: string = (result as any)?.address;

  return { publicKey, address };
};

export const sendOperationRequest = async (
  operations: PartialTezosOperation[],
): Promise<string> => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_sendOperation',
        params: {
          payload: operations,
        },
      },
    },
  });

  console.log('tezos_sendOperation', result);

  return (result as any).opHash;
};

export const sendSignRequest = async (payload: string): Promise<string> => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_signPayload',
        params: {
          payload,
        },
      },
    },
  });

  console.log('tezos_signPayload', result);

  return (result as any).signature.prefixSig;
};

export const sendGetRpc = async () => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_getRpc',
      },
    },
  });

  console.log('tezos_getRpc', result);

  return result as any;
};

export const sendSetRpc = async (
  network: 'mainnet' | 'ghostnet',
  rpcUrl: string,
) => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_setRpc',
        params: {
          network,
          rpcUrl,
        },
      },
    },
  });

  console.log('tezos_setRpc', result);

  return result as any;
};

export const sendClearRpc = async () => {
  const provider = await getMetaMaskProviderAsync();
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'tezos_clearRpc',
      },
    },
  });

  console.log('tezos_clearRpc', result);

  return result as any;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
