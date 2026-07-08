# Ma5znERP - نظام إدارة مخازن الأحذية

Warehouse Management System for shoes inventory built with Node.js, Express, EJS, Tailwind CSS, and Supabase.

## Features

- **Dashboard** — Overview stats, low stock alerts, recent transactions, quick actions
- **Products (Models) Management** — CRUD for shoe models (name, category, color, material, brand)
- **Sizes Management** — CRUD for sizes per model with quantity tracking and minimum stock alerts
- **Stock In (Receive)** — Add stock with supplier info and notes
- **Stock Out (Dispatch)** — Remove stock with reason (sale, transfer, damaged, etc.)
- **Transactions History** — Full audit log with filters (date range, type, item type, search) and pagination
- **Packaging Materials** — Separate inventory for packaging items with in/out quantity tracking
- **Reports** — Category/brand distribution stats, monthly reports
- **Print PDF** — Printable stock and transactions reports
- **Responsive Design** — Works on mobile and desktop with burger menu sidebar
- **Authentication** — Session-based login with cookie storage (Vercel-compatible)

## Tech Stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Backend     | Node.js, Express             |
| Frontend    | EJS templates, Tailwind CSS  |
| Database    | Supabase (PostgreSQL)        |
| Session     | cookie-session (signed cookies) |
| Hosting     | Vercel (serverless)          |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Fill in your Supabase credentials in .env
#    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET

# 4. Run database migrations (apply the schema to Supabase SQL editor)

# 5. Start the server
npm start        # production
npm run dev      # development with auto-reload
```

## Deploy on Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
4. Deploy — the included `vercel.json` handles routing
