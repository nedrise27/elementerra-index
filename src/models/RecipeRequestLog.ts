import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'recipe_request_log',
  underscored: false,
  timestamps: false,
})
export class RecipeRequestLog extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  elements: string[];

  @Column
  timestamp: number;
}
