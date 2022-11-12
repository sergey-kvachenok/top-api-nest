import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreatePageDto } from './dto/create-page.dto';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) { }

  async create(dto: CreatePageDto) {
    return this.topPageModel.create(dto)
  }

  async get(id: string) {
    return this.topPageModel.find({ id }).exec()
  }


  async findByAlias(alias: string) {
    return this.topPageModel.find({ alias }).exec()
  }


  async delete(id: string) {
    return this.topPageModel.findOneAndDelete({ id }).exec()
  }

  async update(id: string, dto: CreatePageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel.aggregate()
      .match({ firstCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } }
      })
      .exec()

    // .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 }).exec()
  }
}
