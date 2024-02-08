import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({ collection: 'elementerra_program_transaction_history' })
export class TransactionHistory {
  @Prop({ required: true, unique: true })
  tx: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true, indexes: [{ slot_1: 1 }, { 'slot_-1': -1 }] })
  slot: number;

  @Prop({ required: true })
  feePayer?: string;

  @Prop({ required: true })
  containsClaimInstruction?: boolean;

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
