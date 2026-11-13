This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## PostgreSQL meeting database

The PostgreSQL schema and sample meeting records are in `db/schema.sql` and
`db/seed.sql`. Configure `DATABASE_URL` with your PostgreSQL connection string,
then run the schema first and the seed script second (for example, in the Neon
SQL Editor). The seed can be run repeatedly; it updates records with matching
dates rather than duplicating them. The application reads meeting data from
this database.

The seed includes nine dates across several meeting types. For example, find
meetings featuring Sister Chen with:

```sql
SELECT date, meeting_type, speakers
FROM meetings
WHERE speakers @> '[{"name":"Sister Chen"}]'::jsonb
ORDER BY date;
```

Paginate the seeded meetings with:

```sql
SELECT date, meeting_type
FROM meetings
ORDER BY date
LIMIT 4 OFFSET 4;
```

The meetings list supports URL-based search and pagination, for example
`/meetings?query=smith&page=1`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
