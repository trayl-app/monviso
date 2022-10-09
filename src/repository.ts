import { PrismaClient } from '../prisma/client';

export abstract class Repository<T> {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  abstract find(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract remove(id: string): Promise<void>;
}
