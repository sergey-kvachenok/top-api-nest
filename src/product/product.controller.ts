import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const existingProduct = await this.productService.findById(id)

    if (!existingProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR)
    }

    return existingProduct
  }


  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id)

    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR)
    }

    return deletedProduct
  }

  @Patch(':id')
  async update(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) {
    const updatedProduct = await this.productService.updateById(id, dto);

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR)
    }

    return updatedProduct
  }

  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto)
  }
}
