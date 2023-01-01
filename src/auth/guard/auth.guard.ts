import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import { isAuthEnabled } from '../config/auth.config';
import { AuthorizedRequest } from '../types';

/**
 * Guard for checking if the user is authenticated
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Check if the user is authenticated and enrich the request with the decoded token
   * @param {ExecutionContext} context - The execution context, containing the request
   * @return {Promise<boolean>} Whether the user is authenticated
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!isAuthEnabled()) {
      this.logger.warn('Authentication is disabled, skipping auth guard');

      return true;
    }

    const token = this.authService.getIdToken(request);

    if (!token) {
      this.logger.error('No token found in request');
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await this.authService.verifyIdToken(token);
      (request as AuthorizedRequest).auth = decodedToken;

      this.logger.log(`User ${decodedToken.user_id} is authenticated`);

      return true;
    } catch (error) {
      this.logger.error(error.message);
      throw new ForbiddenException();
    }
  }
}
