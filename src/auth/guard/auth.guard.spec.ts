import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { TestingModule, Test } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import { isAuthEnabled } from '../config/auth.config';
import { AuthGuard } from './auth.guard';
import { AuthorizedRequest } from '../types';

jest.mock('../config/auth.config');

const contextMock = {
  switchToHttp: jest.fn(),
} as unknown as ExecutionContext;

const switchToHttpMock = {
  getRequest: jest.fn(),
} as unknown as HttpArgumentsHost;

let requestMock: Request;

const authServiceMock = {
  getIdToken: jest.fn(),
  verifyIdToken: jest.fn(),
};

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    module.useLogger(false);

    authGuard = module.get<AuthGuard>(AuthGuard);

    requestMock = {
      headers: {
        Authorization: 'Bearer token',
      },
    } as unknown as Request;

    (isAuthEnabled as jest.Mock).mockReturnValue(true);
    (contextMock.switchToHttp as jest.Mock).mockReturnValue(switchToHttpMock);
    (switchToHttpMock.getRequest as jest.Mock).mockReturnValue(requestMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('canActivate', () => {
    it('should return true if authentication is disabled', async () => {
      (isAuthEnabled as jest.Mock).mockReturnValue(false);

      const actualIsAuthenticated = await authGuard.canActivate(contextMock);

      expect(actualIsAuthenticated).toEqual(true);
    });

    it("should return true if the user's token is valid", async () => {
      const decodedToken = {
        user_id: 'user_id',
      } as unknown as admin.auth.DecodedIdToken;

      (authServiceMock.getIdToken as jest.Mock).mockReturnValue('token');
      (authServiceMock.verifyIdToken as jest.Mock).mockResolvedValue(
        decodedToken,
      );

      const actualIsAuthenticated = await authGuard.canActivate(contextMock);

      expect(actualIsAuthenticated).toEqual(true);
      expect((requestMock as AuthorizedRequest).auth).toEqual(decodedToken);
    });

    it('should throw UnauthorizedException if no token is present', async () => {
      (authServiceMock.getIdToken as jest.Mock).mockReturnValue(null);

      await expect(authGuard.canActivate(contextMock)).rejects.toEqual(
        new UnauthorizedException(),
      );
    });

    it('should throw ForbiddenException if the token is invalid', async () => {
      (authServiceMock.getIdToken as jest.Mock).mockReturnValue('token');
      (authServiceMock.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('error'),
      );

      await expect(authGuard.canActivate(contextMock)).rejects.toEqual(
        new ForbiddenException(),
      );

      expect((requestMock as AuthorizedRequest).auth).toBeUndefined();
    });
  });
});
