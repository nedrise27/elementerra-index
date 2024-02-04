import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'add_to_pending_guesses',
  underscored: true,
  timestamps: false,
})
export class AddToPendingGuess extends Model {
  @Column({ primaryKey: true })
  tx: string;

  @Column
  timestamp: number;

  @Column
  slot: number;

  @Column
  guesser: string;

  @Column
  elementId: string;
}
