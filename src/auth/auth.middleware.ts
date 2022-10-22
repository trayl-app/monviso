import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FirebaseService } from '../common/firebase/firebase.service';

export type AuthRequest = Request & {
  userId?: CreateUserDto['id'];
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
      const token = bearerToken.split(' ')[1];

      const decodedToken = await this.auth.verifyIdToken(token);

      req.userId = decodedToken.user_id;

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization token');
    }
  }
}
