import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({ collection: 'elementerra_program_transaction_history' })
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

  @Prop({
    required: true,
    indexes: [{ fee_payer_1: 1 }, { 'fee_payer_-1': -1 }],
  })
  feePayer: string;

  @Prop({ type: Object })
  data: any;
}

export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
