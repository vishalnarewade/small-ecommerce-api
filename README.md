# Backend

Express + Sequelize backend for the Small Ecommerce admin panel.

## Stack

- Node.js
- Express 5
- Sequelize
- PostgreSQL
- JWT authentication
- Multer for uploads
- ExcelJS for report/sample export

## Install

```bash
npm install
```

## Environment

Create a `.env` file with database and auth configuration:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=db_name
DB_USER=db_usre
DB_PASSWORD=db_password
JWT_SECRET=your-secret
JWT_EXPIRES_IN=
```

Optional seed overrides:

```env
SEED_USER_EMAIL=admin@example.com
SEED_USER_PASSWORD=password123
SEED_USER_STATUS=active
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Default API URL:

```text
http://localhost:3000
```

## Migrations

Run database migrations:

```bash
npm run migrate
```

This creates:

- `schema_migrations`
- `users`
- `category`
- `product`

Seeded data:

- one default user

Default seeded login:

- Email: `admin@example.com`
- Password: `password123`
- Status: `active`

## API Overview

- `POST /api/auth`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST/PUT/DELETE /api/category`
- `GET/POST/PUT/DELETE /api/product`
- `GET /api/report/products`
- `GET /api/report/summary`
- `GET /api/report/export/excel`
- `GET /api/upload/products/sample`
- `POST /api/upload/products`

## Notes

- Most routes are protected with Bearer JWT auth.
- Product and bulk-upload endpoints use multipart form data.
- Product and report lists support search, category filtering, pagination, and numeric price sorting.
- Uploaded product images are served from `/uploads`.
