import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'nft_prices', underscored: true, timestamps: false })
export class NftPrice extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  mint: string;

  @Column
  collection: string;

  @Column
  level: number;

  @Column
  priceInSol: number;

  @Column
  timestamp: number;
}
