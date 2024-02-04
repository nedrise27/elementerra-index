import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema({ collection: 'elementerra_program_transaction_history' })
export class TransactionHistory {
  @Prop({ required: true })
  tx: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  slot: number;

  @Prop({ type: Object })
  data: any;
}

export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
