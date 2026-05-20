# Parvana — site v3

Site web du restaurant **Parvana** à Nantes (cuisine afghane). Inclut un système de
réservation avec validation manuelle par la cheffe Maryam, un panneau admin
mobile-first et un CMS léger pour le menu.

> *Tradition · Création · Saveur*

---

## Stack

- **Next.js 16** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4** (config CSS-first dans `app/globals.css`)
- **shadcn/ui** (composants UI dans `components/ui/`)
- **Neon** — Postgres serverless (Frankfurt EU, GDPR-friendly)
- **Drizzle ORM** + drizzle-kit pour les migrations
- **Clerk** — authentification admin
- **Resend** — emails transactionnels
- **Zod** — validation client + serveur partagée
- **react-hook-form** + **react-day-picker** pour le formulaire de réservation
- Déployé sur **Vercel**

---

## Setup local

### 1. Prérequis

- Node.js **24.x** ou supérieur (`node -v`)
- npm 10+
- Un compte Vercel lié à ce repo (déjà fait)

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d'environnement

Copie `.env.example` vers `.env.local`, puis remplis chaque section.

```bash
cp .env.example .env.local
```

Une fois Neon, Resend et Clerk provisionnés sur Vercel (voir ci-dessous), tu
peux récupérer toutes les valeurs en une commande :

```bash
npx vercel env pull .env.local
```

### 4. Provisionner les services

#### Neon (Postgres)

**Option A — via Vercel Marketplace (recommandé) :**

1. Dashboard Vercel > projet `parvana` > onglet **Storage**
2. **Connect Database** → Neon → région **Frankfurt (eu-central-1)**
3. Les variables `DATABASE_URL` et `DATABASE_URL_UNPOOLED` sont injectées
   automatiquement dans Production, Preview et Development

**Option B — directement sur neon.tech :**

1. Crée un projet sur https://neon.tech (région eu-central-1)
2. Récupère la connection string (pooled et unpooled)
3. Colle-les dans `.env.local`

Puis applique les migrations :

```bash
npm run db:migrate
```

#### Resend (emails)

1. Crée un compte sur https://resend.com
2. Dashboard > **API Keys** → crée une clé, copie-la dans `RESEND_API_KEY`
3. **Tant que le domaine `parvana.fr` n'est pas vérifié dans Resend**, laisse
   `RESEND_FROM_EMAIL=onboarding@resend.dev` (sandbox).
4. Une fois `parvana.fr` vérifié dans Resend > **Domains** :
   - SPF + DKIM + DMARC à ajouter chez le registrar
   - Change `RESEND_FROM_EMAIL=contact@parvana.fr`
5. `ADMIN_EMAIL=maryam@parvana.fr` (adresse réelle où Maryam reçoit les
   notifications)

#### Clerk (auth admin)

**Recommandé — via Vercel Marketplace :**

1. Dashboard Vercel > projet `parvana` > onglet **Storage / Marketplace**
2. **Add Integration** → Clerk → suis le flow
3. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY` sont injectées
   automatiquement

**Inviter Maryam :**

1. Dashboard Clerk > **Users** → **Invite user**
2. Email = valeur de `ADMIN_EMAIL` (ex. `maryam@parvana.fr`)
3. Elle reçoit un email d'invitation, choisit son mot de passe et accède à
   `/admin/login`

> ⚠️ Pas de page d'inscription publique. Le seul moyen de créer un compte
> admin est l'invitation depuis le dashboard Clerk.

### 5. Lancer en dev

```bash
npm run dev
```

→ http://localhost:3000

---

## Routes

### Public

| Route          | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `/`            | Accueil — hero, présentation courte, CTA réservation       |
| `/restaurant`  | Histoire détaillée (Maryam, parcours, engagement)          |
| `/menu`        | Menu midi + soir, ISR 60s (lu depuis Neon, fallback JSON)  |
| `/reservation` | Formulaire de réservation                                  |
| `/contact`     | Adresse, horaires, Google Maps, Instagram                  |
| `/association` | Engagement associatif — contenu à finaliser avec la cliente |

### Admin (protégées Clerk)

| Route                  | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `/admin/login`         | Connexion Clerk (catch-all `[[...rest]]` pour SSO)       |
| `/admin/reservations`  | Tableau de bord mobile-first, filtres, confirm / refuser |
| `/admin/menu`          | CMS léger (textarea JSON validée Zod, versionné en DB)   |

### API

| Route                | Méthode | Description                                  |
| -------------------- | ------- | -------------------------------------------- |
| `/api/reservations`  | POST    | Création d'une réservation publique          |

---

## Workflow de réservation

1. Le client soumet `/reservation`. Validation Zod côté client puis serveur.
2. La réservation est insérée avec `status='pending'` dans Neon.
3. Deux emails partent en parallèle (best-effort via Resend) :
   - **Au client** : accusé de réception + warning *« Tant que vous n'avez
     pas reçu ce mail de confirmation, votre table n'est pas garantie. »*
   - **À Maryam** : récap de la demande + lien vers `/admin/reservations`
     (pas de lien d'action direct — il faut se connecter).
4. Maryam ouvre `/admin/reservations`, voit la nouvelle demande en haut avec
   un point pulse terracotta et un badge non-lu dans la nav.
5. Elle clique **Confirmer** → email automatique de confirmation au client.
   Ou **Refuser** → popover avec textarea pour un message libre → email de
   refus incluant ce message + numéro de téléphone pour rappel.
6. **Aucune réservation n'est jamais auto-confirmée.**

---

## Commandes utiles

| Commande              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Dev server (Turbopack)                            |
| `npm run build`       | Build production                                  |
| `npm run start`       | Serveur production                                |
| `npm run typecheck`   | `tsc --noEmit`                                    |
| `npm run db:generate` | Génère une migration SQL depuis `db/schema.ts`    |
| `npm run db:migrate`  | Applique les migrations sur la DB                 |
| `npm run db:push`     | Push direct du schéma (dev uniquement, sans SQL)  |
| `npm run db:studio`   | UI Drizzle pour explorer la DB en local           |

---

## Structure

```
app/
  (public)/           # routes publiques (SiteNav + SiteFooter hérités)
    layout.tsx
    page.tsx          # /
    restaurant/
    menu/             # ISR 60s, getCurrentMenu() depuis Neon
    reservation/
    contact/
    association/
  admin/
    layout.tsx        # standalone (pas de nav publique)
    login/[[...rest]] # Clerk SignIn
    (authed)/         # protégé Clerk
      layout.tsx      # AdminNav (badge non-lu)
      reservations/
      menu/
  api/
    reservations/     # POST handler
  actions.ts          # Server Actions admin

components/
  site/               # SiteNav, SiteFooter, PhotoPlaceholder, RouteStub
  menu/               # MenuServiceBlock
  reservation/        # ReservationForm (RHF + Zod)
  admin/              # AdminNav, ReservationCard, RejectDialog, MenuEditor
  ui/                 # shadcn/ui (button, input, select, calendar, popover…)

content/
  menu.json           # menu fallback statique (si DB vide)

db/
  schema.ts           # Drizzle: reservations + menus
  index.ts            # client Neon lazy
  migrations/         # SQL versionnées

lib/
  db.ts               # (via db/index.ts)
  email/              # resend.ts + format.ts + templates.ts
  schemas/            # Zod: reservation.ts, menu.ts
  menu.ts             # getCurrentMenu() DB-first + fallback
  utils.ts            # cn() helper

scripts/
  migrate.ts          # db:migrate runner

middleware.ts         # Clerk auth pour /admin/*
```

---

## Déploiement

```bash
npx vercel
```

Vercel détecte Next.js (epingé dans `vercel.json`) et déploie automatiquement.
Les variables d'env injectées par les intégrations Marketplace (Neon, Clerk)
sont visibles dans Settings > Environment Variables.

Pour appliquer une nouvelle migration en prod :

```bash
DATABASE_URL_UNPOOLED="postgres://..." npm run db:migrate
```

Ou plus simple, depuis le projet local lié à Vercel :

```bash
npx vercel env pull .env.production.local
DATABASE_URL_UNPOOLED=$(grep DATABASE_URL_UNPOOLED .env.production.local | cut -d '=' -f2-) npm run db:migrate
```

---

## TODOs côté cliente

Plusieurs emplacements attendent du contenu de Maryam :

- **Photos** : 6+ `<PhotoPlaceholder>` à remplacer dans `app/(public)/`. Cherche
  `// TODO: remplacer par la photo fournie par la cliente` dans le code.
- **Instagram** : 4 permalinks à compléter dans `app/(public)/contact/page.tsx`.
- **Page `/association`** : Lorem ipsum à remplacer. Maryam doit fournir le
  nom de l'association, les modalités de soutien et les bénéficiaires.
- **Prix du menu** : `content/menu.json` (ou via `/admin/menu` une fois Maryam
  connectée) — les prix sont actuellement `null`.
- **Menu soir** : pour l'instant `active: false`. À activer quand le service du
  soir démarrera.

---

## Choix techniques notables

- **Tailwind v4 CSS-first** : pas de `tailwind.config.ts`, palette définie via
  `@theme` dans `globals.css`. Plus simple, recommandé Tailwind 2026.
- **Route groups** : `app/(public)/` et `app/admin/(authed)/` séparent les
  layouts (nav publique vs admin) sans changer les URLs.
- **Menu versionné** : chaque save crée une nouvelle row dans la table `menus`.
  L'historique est préservé naturellement — un rollback est possible via SQL
  manuel (`select * from menus order by version desc`).
- **Pas de RLS** : Neon ≠ Supabase, pas de Row Level Security. La sécurité
  passe par le middleware Clerk + auth check dans chaque Server Action.
- **Emails best-effort** : un échec d'envoi d'email ne casse pas l'insertion
  en DB. Les flags `client_email_sent`, `confirmation_email_sent`,
  `rejection_email_sent` tracent ce qui a vraiment été envoyé.

---

## Hors scope v3 (volontairement)

- Pas de paiement / acompte
- Pas de multi-langue
- Pas de programme fidélité
- Pas de click & collect
- Pas d'avis clients
- Pas de SMS (email Resend uniquement)
- Pas d'export CSV (à ajouter si besoin)
- Pas d'intégration TheFork / Zenchef
