import * as admin from 'firebase-admin';
import { Test } from '@nestjs/testing';
import type { Request } from 'express';
import { AuthService } from './auth.service';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
}));

const mockFirebaseApp = {
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  }),
} as unknown as admin.app.App;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    (admin.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
  });

  describe('getIdToken', () => {
    it('should return null if no Authorization header is present', () => {
      const request = {
        get: () => null,
      } as unknown as Request;

      const actual = authService.getIdToken(request);

      expect(actual).toBeNull();
    });

    it('should return null if no token is present', () => {
      const request = {
        get: () => 'Bearer',
      } as unknown as Request;

      const actual = authService.getIdToken(request);

      expect(actual).toBeNull();
    });

    it('should return the token', () => {
      const expected = 'token';

      const request = {
        get: () => `Bearer ${expected}`,
      } as unknown as Request;

      const actual = authService.getIdToken(request);

      expect(actual).toEqual(expected);
    });
  });

  describe('verifyIdToken', () => {
    it('should call firebaseApp.auth().verifyIdToken', async () => {
      const token = 'token';
      const decodedToken = 'decoded token';

      (mockFirebaseApp.auth().verifyIdToken as jest.Mock).mockResolvedValue(
        decodedToken,
      );

      const actual = await authService.verifyIdToken(token);

      expect(mockFirebaseApp.auth().verifyIdToken).toHaveBeenCalledWith(token);
      expect(actual).toEqual(decodedToken);
    });

    it('should throw if firebaseApp.auth().verifyIdToken throws', async () => {
      (mockFirebaseApp.auth().verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('error'),
      );

      await expect(authService.verifyIdToken('token')).rejects.toThrow('error');
    });
  });
});
