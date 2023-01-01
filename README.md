# Monviso

[![CI](https://github.com/trayl-app/monviso/actions/workflows/ci.yml/badge.svg)](https://github.com/trayl-app/monviso/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/trayl-app/monviso/branch/main/graph/badge.svg?token=IY7HJQ1OYO)](https://codecov.io/gh/trayl-app/monviso) [![Docker Image Size](https://badgen.net/docker/size/trayl/monviso?icon=docker&label=image%20size)](https://hub.docker.com/r/trayl/monviso) [![Code style](https://badgen.net/badge/code%20style/airbnb%20%2B%20prettier/ff5a5f?icon=airbnb&cache=300)](https://github.com/airbnb/javascript)

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

# Test coverage
$ yarn test:cov
```
