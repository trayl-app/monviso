import * as admin from 'firebase-admin';
import type { Request } from 'express';

export interface CommonAuthConfig {
  isAuthEnabled: string;
  devUserId: string;
}

export interface AuthorizedRequest extends Request {
  auth: admin.auth.DecodedIdToken;
}
