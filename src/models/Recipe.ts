import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'recipes', underscored: true, timestamps: false })
export class Recipe extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column(DataType.ARRAY(DataType.STRING))
  elements: string[];

  @Column
  wasSuccessful: boolean;
}
