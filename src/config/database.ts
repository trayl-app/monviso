const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/monviso-db-local?schema=public';

export default DATABASE_URL;
