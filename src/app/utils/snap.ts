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

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
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
  params: Record<'version' | string, unknown> = {}
) => {
  await window.ethereum.request({
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
        snap.id === defaultSnapOrigin && (!version || snap.version === version)
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const sendGetAccount = async () => {
  const result = await window.ethereum.request({
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
  operations: PartialTezosOperation[]
): Promise<string> => {
  const result = await window.ethereum.request({
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
  const result = await window.ethereum.request({
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
  const result = await window.ethereum.request({
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
  rpcUrl: string
) => {
  const result = await window.ethereum.request({
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
  const result = await window.ethereum.request({
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
