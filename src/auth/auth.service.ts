import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthConfig } from './config/auth.config';

/**
 * Service for handling authentication with Firebase
 */
@Injectable()
export class AuthService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(AuthConfig.serviceAccount),
    });
  }

  /**
   * Get the ID token from the request
   * @param {Request} request - The request object
   * @return {string} The ID token extracted from the request
   */
  getIdToken(request: Request): string | null {
    const bearerToken = request.get('Authorization');

    if (!bearerToken) {
      return null;
    }

    const token = bearerToken.split(' ')[1];

    if (!token) {
      return null;
    }

    return token;
  }

  /**
   * Verify the ID token and return the decoded token
   * @param {string} token - The ID token to verify
   * @return {Promise<admin.auth.DecodedIdToken>} The decoded token
   */
  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);

    return decodedToken;
  }
}
