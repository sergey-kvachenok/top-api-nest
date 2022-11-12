import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EXISTING_USER_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/Auth.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) { }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const existingUser = await this.authService.findUser(dto.email)

    if (existingUser) {
      throw new BadRequestException(EXISTING_USER_ERROR)
    }

    return this.authService.createUser(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const { email } = await this.authService.validate(dto);

    return this.authService.login(email)
  }
}
