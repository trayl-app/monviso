import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  private auth: Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.auth;
  }

  async use(req: Request, _: Response, next: () => void) {
    const bearerToken = req.get('Authorization');

    if (!bearerToken) {
      throw new UnauthorizedException('Missing Authorization token');
    }

    try {
      const token = bearerToken.split(' ')[1];

      await this.auth.verifyIdToken(token);

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization token');
    }
  }
}
