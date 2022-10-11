interface Config {
  database: {
    url: string;
  };
}

const config: Config = {
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/monviso-db-local?schema=public',
  },
};

export default config;
