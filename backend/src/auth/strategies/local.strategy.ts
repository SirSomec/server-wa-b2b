import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  validate(req: Request, email: string, password: string) {
    const loginDto: LoginDto = {
      email,
      password,
      tenantId: (req.body?.tenantId as string | undefined) ?? undefined,
    };

    return this.authService.validateUser(loginDto);
  }
}
