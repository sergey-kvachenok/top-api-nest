import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Validate } from 'class-validator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { AuthJwtGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { REVIEW_NOT_FOUND } from './constants';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(@Inject(ReviewService) private readonly reviewService: ReviewService) { }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto)
  }

  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDocument = await this.reviewService.delete(id)

    if (!deletedDocument) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

  }

  // @UseGuards(AuthJwtGuard)
  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
    return this.reviewService.findByProductId(productId)
  }
}
