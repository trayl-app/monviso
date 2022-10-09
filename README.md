# Monviso

[![CI](https://github.com/trayl-app/monviso/actions/workflows/ci.yml/badge.svg)](https://github.com/trayl-app/monviso/actions/workflows/ci.yml)

This is the micro-service responsible for managing users and user profiles.

## Installation

```bash
$ yarn
```

## Running the app

The app uses a dockerized instance of PostgreSQL, so first run the container:

```bash
$ docker compose up
```

Next run the Prisma migrations and generate the related types:

```bash
# Run migrations
$ yarn migrate:dev

# Generate types
$ yarn generate
```

Eventually, you can also seed the database with some dummy data:

```bash
$ yarn seed
```

Finally, you can run the app:

```bash
# Development
$ yarn start

# Watch mode
$ yarn start:dev

# Production mode
$ yarn start:prod
```

## Test

To run the application's tests, run one of the following commands:

```bash
# Unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# Test coverage
$ yarn test:cov
```
