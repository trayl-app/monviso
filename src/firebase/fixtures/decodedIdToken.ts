import { faker } from '@faker-js/faker';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const decodedIdTokenFixture = (
  overrides?: Partial<DecodedIdToken>,
): DecodedIdToken => ({
  uid: faker.datatype.uuid(),
  aud: 'aud',
  auth_time: faker.date.past().getTime(),
  exp: faker.date.future().getTime(),
  firebase: {
    identities: {
      email: faker.internet.email(),
    },
    sign_in_provider: 'google.com',
    second_factor_identifier: faker.datatype.uuid(),
    sign_in_second_factor: 'phone',
  },
  iat: faker.date.past().getTime(),
  iss: 'https://securetoken.google.com/aud',
  sub: faker.datatype.uuid(),
  email: faker.internet.email(),
  email_verified: faker.datatype.boolean(),
  phone_number: faker.phone.number(),
  picture: faker.image.imageUrl(),
  ...overrides,
});
