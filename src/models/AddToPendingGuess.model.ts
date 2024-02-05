import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Element } from './Element.model';
import { ForgeAttempt } from './ForgeAttempt.model';

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

  @ForeignKey(() => Element)
  @Column
  elementId: string;

  @ForeignKey(() => ForgeAttempt)
  @Column
  forgeAttemptTx: string;
}
