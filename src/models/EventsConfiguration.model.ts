import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'events_configurations', underscored: true, timestamps: false})
export class EventsConfigurationModel extends Model {
  @Column({ primaryKey: true })
  guesser: string;

  @Column
  enableEvents: boolean
}