export class TokenBalanceChange {
  mint: string;
  rawTokenAmount: {
    decimals: number;
    tokenAmount: string;
  };
  tokenAccount: string;
  userAccount: string;
}

export class AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

export class NftEvent {
  amount: number;
  buyer: string;
  description: string;
  fee: number;
  feePayer: string;
  nfts: { mint: string; tokenStandard: string }[];
  saleType: string;
  seller: string;
  signature: string;
  slot: number;
  source: string;
  staker: string;
  timestamp: number;
  type: string;
}

export class CompressedEvent {
  assetId: string;
  innerInstructionIndex: number;
  instructionIndex: number;
  leafIndex: number;
  newLeafDelegate: string;
  newLeafOwner: string;
  oldLeafDelegate?: any;
  oldLeafOwner?: any;
  seq: number;
  treeDelegate: string;
  treeId: string;
  type: string;
}
export type Events = { nft: NftEvent[] } | { compressed: CompressedEvent[] };

export class NativeTransfer {
  amount: number;
  fromUserAccount: string;
  toUserAccount: string;
}

export class TokenTransfer {
  fromTokenAccount: string;
  fromUserAccount: string;
  mint: string;
  toTokenAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  tokenStandard: string;
}

export class InnerInstruction {
  accounts: string[];
  data: string;
  programId: string;
}

export class Instruction {
  accounts: string[];
  data: string;
  innerInstructions: InnerInstruction[];
  programId: string;
}

export class ParsedTransaction {
  accountData: AccountData[];
  description: string;
  events: Events;
  fee: number;
  feePayer: string;
  nativeTransfers: NativeTransfer[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  type: string;
  instructions: Instruction[];
  transactionError?: any;
}
