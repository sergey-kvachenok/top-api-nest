import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/Auth.dto';
import { UserModel } from './user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { INCORRECT_PASSWORD, WRONG_USER } from './auth.constants';
import { IsJWT } from 'class-validator';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService) { }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.email,
      passwordHash: await hash(dto.password, salt)
    })

    return newUser.save()

  }

  findUser(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  async validate({ email, password }: AuthDto): Promise<Pick<UserModel, 'email'>> {
    const currentUser = await this.findUser(email)

    if (!currentUser) {
      throw new UnauthorizedException(WRONG_USER)
    }

    const isPasswordCorrect = await compare(password, currentUser.passwordHash)

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(INCORRECT_PASSWORD)
    }

    return { email }
  }

  async login(email: string) {
    const payload = { email };
    const token = await this.jwtService.signAsync(payload)

    return ({
      access_token: token
    })
  }
}
