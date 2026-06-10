import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: CreateUserDto) {
    try {
      const { password, ...rest } = dto;
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.userService.create({
        ...rest,
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException(`
        gagal mendaftar karena: ${error}`);
    }
  }
}
