# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Car Service Dashboard (`/`)
- **Type**: react-vite
- **Path**: `artifacts/car-service-dashboard/`
- **Pages**: Dashboard, Appointments, Customers, Vehicles, Services, Technicians
- **Theme**: Slate sidebar + amber accent (automotive palette)

### API Server (`/api`)
- **Type**: Express 5 backend
- **Path**: `artifacts/api-server/`
- **Entities**: customers, vehicles, services, technicians, appointments
- **Dashboard endpoints**: /dashboard/summary, /dashboard/recent-activity, /dashboard/service-breakdown, /dashboard/revenue-by-month

## DB Schema (lib/db/src/schema/)
- `customers.ts` — customer records
- `vehicles.ts` — vehicle registry linked to customers
- `services.ts` — service catalog with pricing
- `technicians.ts` — staff roster with availability
- `appointments.ts` — bookings linking all entities

## Notes
- `lib/api-zod/src/index.ts` exports only from `./generated/api` (not `./generated/types`) to avoid Orval duplicate export collision
- Seed data: 6 customers, 7 vehicles, 8 services, 4 technicians, 14 appointments
