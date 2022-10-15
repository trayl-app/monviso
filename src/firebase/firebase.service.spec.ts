import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import firebase from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import getFirebaseConfig from './config';
import { FirebaseService } from './firebase.service';

jest.mock('./config');
jest.mock('firebase-admin/app');
jest.mock('firebase-admin', () => ({
  default: {
    initializeApp: jest.fn(),
    auth: jest.fn(),
  },
}));

const projectId = 'projectId';
const firebaseConfig = {
  projectId,
};
const firebaseApp = {
  name: 'firebaseApp',
};
const firebaseAuth = {
  currentUser: {
    email: 'user@email.it',
  },
};

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    (firebase.initializeApp as jest.Mock).mockReturnValue(firebaseApp);
    (firebase.auth as jest.Mock).mockReturnValue(firebaseAuth);
    (cert as jest.Mock).mockReturnValue({ projectId });
    (getFirebaseConfig as jest.Mock).mockReturnValue(firebaseConfig);

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FirebaseService],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should correctly initialize the Firebase App and Auth', () => {
    expect(cert).toHaveBeenCalledWith(firebaseConfig);
    expect(firebase.initializeApp).toHaveBeenCalledWith({
      credential: {
        projectId,
      },
    });
    expect(firebase.auth).toHaveBeenCalledWith(firebaseApp);
    expect(service.auth).toBeDefined();
    expect(service.app).toBeDefined();
  });

  it('should return the Firebase App', () => {
    expect(service.app).toEqual(firebaseApp);
  });

  it('should return the Firebase Auth', () => {
    expect(service.auth).toEqual(firebaseAuth);
  });
});
