import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({ collection: 'elementerra_transaction_history' })
export class TransactionHistory {
  @Prop({
    required: true,
    unique: true,
    indexes: [{ tx_1: 1 }, { 'tx_-1': -1 }],
  })
  tx: string;

  @Prop({
    required: true,
    indexes: [{ timestamp_1: 1 }, { 'timestamp_-1': -1 }],
  })
  timestamp: number;

  @Prop({ required: true, indexes: [{ slot_1: 1 }, { 'slot_-1': -1 }] })
  slot: number;

  @Prop({ required: true, indexes: [{ fee_payer_text: 'text' }] })
  feePayer?: string;

  @Prop({ required: true })
  containsClaimInstructions?: boolean;

  @Prop({ required: true })
  containsAddToPendingGuessInstruction?: boolean;

  @Prop({ type: Object })
  data: {
    events?: {
      compressed?: {
        assetId?: string;
      }[];
    };
  };
}

export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
