import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { ForgeAttempt } from './ForgeAttempt.model';

@Table({ tableName: 'elements', underscored: true, timestamps: false })
export class Element extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  symbol: string;

  @ForeignKey(() => ForgeAttempt)
  @Column
  forgeAttemptTx: string;

  @BelongsTo(() => ForgeAttempt)
  forgeAttempt: ForgeAttempt;
}
