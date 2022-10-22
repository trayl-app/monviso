import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { NextFunction, Request, Response } from 'express';
import { FirebaseService } from '../common/firebase/firebase.service';
import { UserEntity } from '../users/entities/user.entity';

export type AuthRequest = Request & {
  userId?: UserEntity['id'];
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private auth: Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.auth;
  }

  async use(req: AuthRequest, _: Response, next: NextFunction) {
    const bearerToken = req.get('Authorization');

    if (!bearerToken) {
      throw new UnauthorizedException('Missing Authorization token');
    }

    try {
      /**
       * How to use:
       *  - development: Bearer <userId>
       *  - production/test: Bearer <valid firebase id token>
       */
      const token = bearerToken.split(' ')[1];

      if (process.env.NODE_ENV !== 'development') {
        const decodedToken = await this.auth.verifyIdToken(token);

        req.userId = decodedToken.user_id;
      } else {
        req.userId = token;
      }

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization token');
    }
  }
}
