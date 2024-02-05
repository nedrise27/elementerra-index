import { Model, Column, Table, HasMany } from 'sequelize-typescript';

import { Element } from './Element.model';
import { AddToPendingGuess } from './AddToPendingGuess.model';

@Table({ tableName: 'forge_attempts', underscored: true, timestamps: false })
export class ForgeAttempt extends Model {
  @Column({ primaryKey: true })
  tx: string;

  @Column
  timestamp: number;

  @Column
  slot: number;

  @Column
  guesser: string;

  @Column
  isInvention: boolean;

  @Column
  hasFailed: boolean;

  @HasMany(() => Element)
  guess: Element[];

  @HasMany(() => AddToPendingGuess)
  addToPendingGuesses: AddToPendingGuess[];
}
