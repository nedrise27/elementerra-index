import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'transaction_history',
  underscored: true,
  timestamps: false,
})
export class TransactionHistory extends Model {
  @Column({ primaryKey: true })
  tx: string;

  @Column
  slot: number;

  @Column
  timestamp: number;

  @Column
  feePayer: string;

  @Column
  containsClaimInstruction: boolean;

  @Column
  containsAddToPendingGuessInstruction: boolean;

  @Column
  transactionError: boolean;

  @Column({ type: DataType.JSONB })
  data: Record<string, any>;
}
