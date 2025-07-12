import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.warn('JWT auth failed: ', info?.message || info);
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
