import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserEntity implements User {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
