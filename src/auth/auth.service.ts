import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginResponseDTO, LoginRequestDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      return await this.userService.create(dto);
    } catch (error) {
      throw new InternalServerErrorException(`
        gagal mendaftar karena: ${error}`);
    }
  }
  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { username, password } = dto;
    const user = await this.userService.findForLogin(username);
    if (!user) {
      throw new NotFoundException('Username tidak ditemukan');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password salah');
    }
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
