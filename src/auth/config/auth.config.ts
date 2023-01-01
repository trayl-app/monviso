import { ServiceAccount } from 'firebase-admin';
import { CommonAuthConfig } from '../types';

export class AuthConfig {
  static get serviceAccount(): ServiceAccount {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    };
  }

  static get commonConfig(): CommonAuthConfig {
    return {
      isAuthEnabled: process.env.IS_AUTH_ENABLED || 'false',
      devUserId: process.env.DEV_USER_ID || '',
    };
  }
}

export const isAuthEnabled = (): boolean =>
  AuthConfig.commonConfig.isAuthEnabled === 'true';
