import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY',
    });
  }

  async validate(payload: any) {
    console.log('--- JWT STRATEGY START ---');
    console.log('Payload received:', payload);

    const user = await this.authService.validateUserById(payload.sub);
    console.log('User found in DB:', user);

    if (!user) {
      console.log('ERROR: Token valid, but user not found in DB.');
      throw new UnauthorizedException('Token is valid, but user no longer exists.');
    }

    console.log('--- JWT STRATEGY SUCCESS ---');
    return user;
  }
}