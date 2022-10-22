import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthMiddleware } from './auth.middleware';
import { FirebaseService } from '../common/firebase/firebase.service';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let service: FirebaseService;

  beforeEach(async () => {
    service = {
      auth: {
        verifyIdToken: jest.fn(),
      },
    } as any as FirebaseService;

    middleware = new AuthMiddleware(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw UnauthorizedException if the bearer token is missing', async () => {
    const req = {
      get: jest.fn(),
    } as any as Request;

    const error = new UnauthorizedException('Missing Authorization token');

    await expect(middleware.use(req, null, null)).rejects.toThrow(error);
  });

  it('should throw UnauthorizedException if the bearer token is invalid', async () => {
    (service.auth.verifyIdToken as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    const req = {
      get: jest.fn().mockReturnValue('Bearer invalid-token'),
    } as any as Request;

    const error = new UnauthorizedException('Invalid Authorization token');

    await expect(middleware.use(req, null, null)).rejects.toThrow(error);
  });

  it('should call next if the bearer token is valid', async () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer valid-token'),
    } as any as Request;

    (service.auth.verifyIdToken as jest.Mock).mockResolvedValue({
      userId: 'userId',
    });

    const next = jest.fn();

    await middleware.use(req, null, next);

    expect(next).toHaveBeenCalled();
  });
});
