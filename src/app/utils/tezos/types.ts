export enum TezosOperationType {
  ENDORSEMENT = 'endorsement',
  SEED_NONCE_REVELATION = 'seed_nonce_revelation',
  DOUBLE_ENDORSEMENT_EVIDENCE = 'double_endorsement_evidence',
  DOUBLE_BAKING_EVIDENCE = 'double_baking_evidence',
  ACTIVATE_ACCOUNT = 'activate_account',
  PROPOSALS = 'proposals',
  BALLOT = 'ballot',
  REVEAL = 'reveal',
  TRANSACTION = 'transaction',
  ORIGINATION = 'origination',
  DELEGATION = 'delegation',
}

export type TezosOperation = {
  kind: TezosOperationType;
};

export type TezosTransactionOperation = {
  kind: TezosOperationType.TRANSACTION;
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  amount: string;
  destination: string;
  parameters?: any;
} & TezosOperation;

export type TezosOriginationOperation = {
  kind: TezosOperationType.ORIGINATION;
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  balance: string;
  delegate?: string;
  script: string;
} & TezosOperation;

export type TezosRevealOperation = {
  kind: TezosOperationType.REVEAL;
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  public_key: string;
} & TezosOperation;

export type TezosDelegationOperation = {
  kind: TezosOperationType.DELEGATION;
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  delegate?: string;
} & TezosOperation;

// run_operation response
export type RunOperationBalanceUpdate = {
  kind: string;
  contract: string;
  change: string;
  category: string;
  delegate: string;
  cycle?: number;
};

export type RunOperationOperationBalanceUpdate = {
  kind: string;
  contract: string;
  change: string;
};

export type RunOperationOperationResult = {
  status: string;
  errors?: unknown;
  balance_updates: RunOperationOperationBalanceUpdate[];
  consumed_milligas: string;
  paid_storage_size_diff?: string;
  originated_contracts?: string[];
  allocated_destination_contract?: boolean;
};

export type RunOperationInternalOperationResult = {
  result?: {
    errors?: unknown;
    consumed_milligas: string;
    paid_storage_size_diff?: string;
    originated_contracts?: string[];
    allocated_destination_contract?: boolean;
  };
  parameters?: {
    entrypoint: string;
    value: unknown;
  };
};

export type RunOperationMetadata = {
  balance_updates: RunOperationBalanceUpdate[];
  operation_result: RunOperationOperationResult;
  internal_operation_results?: RunOperationInternalOperationResult[];
};

export type RunOperationResponse = {
  contents: (TezosOperation & {
    metadata: RunOperationMetadata;
  })[];
  signature: string;
};

export type TezosWrappedOperation = {
  branch: string;
  contents: TezosOperation[];
};
