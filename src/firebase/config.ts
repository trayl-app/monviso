import { ConfigService } from '@nestjs/config';

const getFirebaseConfig = (configService: ConfigService) => ({
  type: configService.get('FIREBASE_TYPE'),
  project_id: configService.get('FIREBASE_PROJECT_ID'),
  private_key_id: configService.get('FIREBASE_PRIVATE_KEY_ID'),
  private_key: configService.get('FIREBASE_PRIVATE_KEY'),
  client_email: configService.get('FIREBASE_CLIENT_EMAIL'),
  client_id: configService.get('FIREBASE_CLIENT_ID'),
  auth_uri: configService.get('FIREBASE_AUTH_URI'),
  token_uri: configService.get('FIREBASE_TOKEN_URI'),
  auth_provider_x509_cert_url: configService.get(
    'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
  ),
  client_x509_cert_url: configService.get('FIREBASE_CLIENT_X509_CERT_URL'),
});

export default getFirebaseConfig;
