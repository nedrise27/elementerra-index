import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Element } from './models/Element.model';

@Injectable()
export class ElementsService {
  constructor(
    @InjectModel(Element)
    private elementModel: typeof Element,
  ) {}

  async create(id: string, name: string, symbol: string): Promise<Element> {
    return this.elementModel.create({
      id,
      name,
      symbol,
    });
  }

  async findOne(id: string): Promise<Element> {
    return this.elementModel.findOne({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Element[]> {
    return this.elementModel.findAll();
  }
}
