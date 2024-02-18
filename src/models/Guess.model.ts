import { Guess } from 'clients/elementerra-program/accounts';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { cleanAndOrderRecipe } from 'src/lib/elements';

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

  public static fromGuess(address: string, guess: Guess): GuessModel {
    return {
      address: address,
      seasonNumber: guess.seasonNumber,
      numberOfTimesTried: guess.numberOfTimesTried.toNumber(),
      isSuccess: guess.isSuccess,
      element: guess.element.toString(),
      recipe: cleanAndOrderRecipe([
        guess.elementTried1Name,
        guess.elementTried2Name,
        guess.elementTried3Name,
        guess.elementTried4Name,
      ]),
      creator: guess.creator.toString(),
    } as GuessModel;
  }
}
