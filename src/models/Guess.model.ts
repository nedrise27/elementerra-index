import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'guesses', underscored: true, timestamps: false })
export class GuessModel extends Model {
  @Column({ primaryKey: true })
  address: string;

  @Column
  seasonNumber: number;

  @Column
  numberOfTimesTried: number;

  @Column
  isSuccess: boolean;

  @Column
  element: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  recipe: string[];

  @Column
  creator: string;
}
