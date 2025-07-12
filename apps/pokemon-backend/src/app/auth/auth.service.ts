import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepo.findOneBy({ email: dto.email }),
      this.userRepo.findOneBy({ username: dto.username }),
    ]);

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      email: dto.email,
      username: dto.username,
      password: hashed,
    });

    await this.userRepo.save(newUser);

    return { message: 'Register successful' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async recoverPassword(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Giả lập gửi email reset
    return {
      message: 'Recovery email has been sent (simulated)',
      email,
    };
  }
}
