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

export class Event {
  nft: {
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
  };
  [type: string]: any;
}

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

export class HeliusWebhookTransactionItem {
  accountData: AccountData[];
  description: string;
  events: Event[];
  fee: number;
  feePayer: string;
  nativeTransfers: NativeTransfer[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  type: string;
}
