# HiveMind

Apiary manager for beekeepers: one owner, several apiaries, every hive in one place.
React Native + Expo (iOS, Android, web), Supabase for auth (JWT) and data.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the Supabase project URL and publishable key
   (Supabase dashboard > Project Settings > API Keys). Never use the secret / service_role key.
3. Create the database: open the Supabase **SQL Editor**, paste `supabase/migrations/001_apiaries.sql` and run it once.
4. Create a test user: Supabase > Authentication > Users > Add user (tick *Auto Confirm User*).

## Run

- `npm run web` runs the app in the browser (quick check; validate on a phone regularly).
- `npx expo start --tunnel` runs it on a phone with Expo Go (the tunnel is needed on Eduroam).

## Tests

End-to-end tests with Cypress, with the app running on `http://localhost:8081`:

```
CYPRESS_TEST_EMAIL=you@example.com CYPRESS_TEST_PASSWORD=... npm run cypress:run
```

## Project rules

- Keep the folder structure; folders may be added.
- UI is built on the base components in `src/components/primitives`.
- Everything is typed: no `null`, no `as` without a comment, no `never`.
- No API calls in components: everything goes through `src/services`.
- Styling lives in `*.styles.ts` files next to the component (or in `src/styles`); shared values in `src/theme/theme.ts`.
