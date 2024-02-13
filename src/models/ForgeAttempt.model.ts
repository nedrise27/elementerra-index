import { Column, DataType, Model, Table } from 'sequelize-typescript';

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

  @Column
  guessAddress: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  guess: string[];
}
