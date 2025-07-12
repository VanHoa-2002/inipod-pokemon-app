import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @route POST /auth/register
   * @desc Register a new user
   */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * @route POST /auth/login
   * @desc Login and return JWT
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * @route POST /auth/recovery
   * @desc Recover password
   */
  @Post('recovery')
  async recovery(@Body('email') email: string) {
    return this.authService.recoverPassword(email);
  }
}
