<a id="readme-top"></a>

<div align="center">
  <img src="public/icons/icon-192.png" alt="HiveMind logo" width="96" height="96">

  <h1>HiveMind</h1>

  <p>
    Apiary manager for beekeepers: one owner, several apiaries, every hive in one place.
    <br />
    <a href="https://beekeeping-app-seven.vercel.app"><strong>Open the live demo »</strong></a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#live-demo">Live Demo</a></li>
    <li><a href="#target-audience">Target Audience</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#competitors">Competitors</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#run">Run</a></li>
    <li><a href="#tests">Tests</a></li>
    <li><a href="#project-rules">Project Rules</a></li>
  </ol>
</details>

## About The Project

Beekeepers often keep their hive records in a notebook, a spreadsheet or their head. That works for one apiary,
but not when you have hives in several places or share an apiary with other beekeepers.

HiveMind keeps it all in one place:

- **Apiaries**: create, edit and delete apiaries with an address and notes.
- **Hives**: add hives to an apiary and pick the hive type (Dadant, Langstroth, Simplex, ...).
- **Queen details**: birth year with the international marking colour, breed, and whether the queen is marked,
  clipped and mated.
- **Roles per apiary**: every apiary has an owner. Members are an administrator, contributor or read-only, and the
  database (Row Level Security) decides what each role may do:

  | Role          | View | Add and edit hives | Edit apiary | Delete apiary |
  | ------------- | :--: | :----------------: | :---------: | :-----------: |
  | Owner         |  ✅  |         ✅         |     ✅      |      ✅       |
  | Administrator |  ✅  |         ✅         |     ✅      |               |
  | Contributor   |  ✅  |         ✅         |             |               |
  | Read-only     |  ✅  |                    |             |               |

HiveMind runs on iOS, Android and the web. The web version is a Progressive Web App: you can install it on your
phone or desktop from the browser, and the app shell keeps working without a connection.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- [Expo](https://expo.dev) / [React Native](https://reactnative.dev) (iOS, Android and web from one codebase)
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- [Supabase](https://supabase.com) (authentication with JWT and a hosted PostgreSQL database)
- [Zustand](https://zustand.docs.pmnd.rs) (state management)
- [Cypress](https://www.cypress.io) (end-to-end tests)
- [Storybook](https://storybook.js.org) (base components)
- [Vercel](https://vercel.com) (hosting of the web app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Live Demo

**https://beekeeping-app-seven.vercel.app**

Log in with the demo account:

| Email      | Password   |
| ---------- | ---------- |
| `TODO`     | `TODO`     |

The demo account already has a few apiaries and hives. The database is hosted on Supabase.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Target Audience

- **Hobby and small-scale beekeepers** with a handful of hives spread over one or more apiaries, who want their
  records on their phone instead of in a notebook.
- **Beekeeping associations** that share apiaries between members and want to agree on who may change what.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Log in with email and password (Supabase Auth)
- [x] Apiaries: create, edit and delete
- [x] Roles per apiary, enforced by Row Level Security
- [x] Hives: add to an apiary and edit
- [x] Queen details: birth year and marking colour, breed, marked, clipped, mated
- [x] Installable PWA with a service worker
- [ ] Share apiaries: invite other beekeepers and give them a role
- [ ] Inspections per hive: brood, queen seen, temperament, notes
- [ ] Honey harvest per hive and per season
- [ ] Offline use: enter data without a connection and sync it later

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Competitors

| App | What it is | How HiveMind is different |
| --- | ---------- | ------------------------- |
| [HiveTracks](https://hivetracks.com) | Beekeeping assistant for iOS and Android with hive health tracking, tasks and a bee weather forecast. Free base app with a paid subscription. | Free, and it runs in the browser as a PWA, so there is nothing to install from an app store. |
| [Apiary Book](https://www.apiarybook.com) | Record-keeping app for colonies, inspections and treatments, with a freemium model. | Built around sharing apiaries: every apiary has an owner and members with clear roles. |
| [BeeKeepPal](https://beekeeppal.com) | Cloud platform for hobby and commercial beekeepers with inspections, reports, a task scheduler and a financial tracker. Limited free tier, paid Pro plan. | Smaller and simpler: focused on apiaries, hives and queens for hobby beekeepers and associations. |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js 18 or newer and npm
- A free [Supabase](https://supabase.com) project

### Installation

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the Supabase project URL and publishable key
   (Supabase dashboard > Project Settings > API Keys). Never use the secret / service_role key.
3. Create the database: open the Supabase **SQL Editor** and run the migrations in `supabase/migrations` once,
   in this order:
   1. `001_apiaries.sql` (apiaries, members and roles)
   2. `002_hives.sql` (hives)
   3. `003_hive_queen.sql` (queen details)
4. Create a test user: Supabase > Authentication > Users > Add user (tick *Auto Confirm User*).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Run

- `npm run web` runs the app in the browser (quick check; validate on a phone regularly).
- `npx expo start --tunnel` runs it on a phone with Expo Go (the tunnel is needed on Eduroam).
- `npx expo export -p web` builds the web app (with the service worker) into `dist/`.

## Tests

End-to-end tests with Cypress, with the app running on `http://localhost:8081`:

```
CYPRESS_TEST_EMAIL=you@example.com CYPRESS_TEST_PASSWORD=... npm run cypress:run
```

## Project Rules

- Keep the folder structure; folders may be added.
- UI is built on the base components in `src/components/primitives`.
- Everything is typed: no `null`, no `as` without a comment, no `never`.
- No API calls in components: everything goes through `src/services`.
- Styling lives in `*.styles.ts` files next to the component (or in `src/styles`); shared values in `src/theme/theme.ts`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
