import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { FindProductDto } from 'src/product/dto/find-product.dto';
import { ProductModel } from 'src/product/product.model';
import { CreatePageDto } from './dto/create-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) { }

  @Post('create')
  async create(@Body() dto: CreatePageDto) {
    return this.topPageService.create(dto)
  }

  @Get(':id',)
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.get(id)

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return page
  }

  @Get('byAlias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    console.log({ alias })
    const existingProduct = await this.topPageService.findByAlias(alias)

    if (!existingProduct) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return existingProduct
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.delete(id)

    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return deletedPage
  }

  @Patch(':id')
  async update(@Param('id', IdValidationPipe) id: string, @Body() dto: CreatePageDto) {
    const updatedPage = await this.topPageService.update(id, dto)

    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return updatedPage
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory)
  }
}
