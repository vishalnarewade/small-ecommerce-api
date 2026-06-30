# Database Migrations

Run migrations with:

```bash
npm run migrate
```

What it creates:

- `users`
- `category`
- `product`
- `schema_migrations`

Seeded data:

- One default user in `users`

Default seeded credentials:

- Email: `admin@example.com`
- Password: `password123`
- Status: `admin`

You can override them with env vars before running migrations:

- `SEED_USER_EMAIL`
- `SEED_USER_PASSWORD`
- `SEED_USER_STATUS`
