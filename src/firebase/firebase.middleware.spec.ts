import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { FirebaseAuthMiddleware } from './firebase.middleware';
import { FirebaseService } from './firebase.service';
import { decodedIdTokenFixture } from './fixtures/decodedIdToken';

jest.mock('./firebase.service');

describe('FirebaseMiddleware', () => {
  let middleware: FirebaseAuthMiddleware;

  beforeEach(async () => {
    (FirebaseService as jest.Mock).mockReturnValue({
      auth: {
        verifyIdToken: jest.fn(),
      },
    });

    const service = new FirebaseService(new ConfigService());

    middleware = new FirebaseAuthMiddleware(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw UnauthorizedException if the bearer token is missing', () => {
    const req = {
      get: jest.fn(),
    } as any as Request;

    const error = new UnauthorizedException('Missing Authorization token');

    expect(middleware.use(req, null, null)).rejects.toThrow(error);
  });

  it('should throw UnauthorizedException if the bearer token is invalid', async () => {
    (FirebaseService as jest.Mock).mockReturnValue({
      auth: {
        verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
      },
    });

    const req = {
      get: jest.fn().mockReturnValue('Bearer invalid-token'),
    } as any as Request;

    const error = new UnauthorizedException('Invalid Authorization token');

    await expect(middleware.use(req, null, null)).rejects.toThrow(error);
  });

  it('should call next if the bearer token is valid', async () => {
    (FirebaseService as jest.Mock).mockReturnValue({
      auth: {
        verifyIdToken: jest.fn().mockResolvedValue(decodedIdTokenFixture()),
      },
    });

    const req = {
      get: jest.fn().mockReturnValue('Bearer valid-token'),
    } as any as Request;

    const next = jest.fn();

    await middleware.use(req, null, next);

    expect(next).toHaveBeenCalled();
  });
});
