# Sycamore API

A [NestJS](https://nestjs.com/) API with PostgreSQL and Sequelize. Includes wallet transfer (idempotent) and interest accrual.

## Prerequisites

- **Node.js** (v18 or v20 recommended)
- **Yarn**
- **PostgreSQL** (running locally or reachable via `DATABASE_URL`)

## Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Environment variables

Copy the example env file and set your values:

```bash
cp .env.example .env
```

Edit `.env`. Required:

| Variable       | Description                          | Example                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string         | `postgresql://postgres:postgres@localhost:5432/postgres` |
| `PORT`         | Server port (optional, default 3000)  | `3000`                                       |
| `NODE_ENV`     | Environment (optional)                | `development`                                |

Optional:

| Variable    | Description              | Example  |
|-------------|--------------------------|----------|
| `DB_USE_SSL`  | Use SSL for DB connection | `false` |
| `DB_LOGGING`  | Log Sequelize queries    | `false` |

The app will not start if `DATABASE_URL` is missing or invalid.

### 3. Database migrations

Create tables (wallets, transaction_logs, interest_accruals):

```bash
yarn db:migrate
```

To roll back the last migration:

```bash
yarn db:migrate:undo
```

### 4. Run the application

```bash
# development (watch mode)
yarn start:dev

# production
yarn build
yarn start:prod
```

The API is available at `http://localhost:3000` with global prefix `/api` and default version `v1` (e.g. `http://localhost:3000/api/v1/...`).

## Scripts

| Command            | Description                |
|--------------------|----------------------------|
| `yarn start`       | Start once                 |
| `yarn start:dev`   | Start in watch mode        |
| `yarn start:prod`  | Run production build      |
| `yarn build`       | Build for production       |
| `yarn test`        | Run unit tests             |
| `yarn test:cov`    | Run tests with coverage    |
| `yarn test:e2e`    | Run e2e tests              |
| `yarn db:migrate`  | Run Sequelize migrations   |
| `yarn db:migrate:undo` | Undo last migration   |
| `yarn db:seed`     | Run seeders                |
| `yarn lint`        | Lint and fix               |

## License

UNLICENSED (private).
