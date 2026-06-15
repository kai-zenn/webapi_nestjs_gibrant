import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginRequestDTO } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const data = await this.authService.register(dto);

    return {
      success: true,
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: data.createdAt,
      },
      message: `Registrasi Berhasil selamat datang ${data.username}.`,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginRequestDTO) {
    const result = await this.authService.login(dto);

    return {
      success: true,
      data: result,
      message: 'Login Berhasil.',
    };
  }
}
