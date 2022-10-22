import firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/lib/auth/auth';
import getFirebaseConfig from './config';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App;

  private readonly firebaseAuth: Auth;

  constructor(configService: ConfigService) {
    this.firebaseApp = firebase.initializeApp({
      credential: cert({
        ...getFirebaseConfig(configService),
      } as firebase.ServiceAccount),
    });

    this.firebaseAuth = firebase.auth(this.firebaseApp);
  }

  get auth(): Auth {
    return this.firebaseAuth;
  }

  get app(): App {
    return this.firebaseApp;
  }
}
