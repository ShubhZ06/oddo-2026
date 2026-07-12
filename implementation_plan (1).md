# TransitOps: Smart Transport Operations Platform — Master Plan

## Overview

Build a full-stack, responsive web application that digitizes fleet operations — covering vehicles, drivers, trips, maintenance, fuel/expenses, and analytics — with strict business rule enforcement and role-based access control.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Full-stack React framework with file-based routing, API routes, SSR/CSR flexibility, type safety |
| ORM | **Prisma** | Type-safe database access, migrations, seeding, excellent DX |
| Database | **MySQL (Local)** | Production-grade relational DB, running locally |
| Tunneling | **ngrok** | Expose local dev server for sharing/demo access |
| Auth | **NextAuth.js (v5)** | Built-in credentials provider, session management, middleware-based route protection |
| Styling | **Tailwind CSS v4** | Utility-first CSS for rapid UI development, removing CSS module overhead |
| Charts | **Chart.js + react-chartjs-2** | Lightweight, beautiful charts for analytics |
| PDF Export | **jsPDF + jspdf-autotable** | Client-side PDF generation (bonus) |
| CSV Export | **Custom utility** | Simple CSV string builder |
| Icons | **Lucide React** | Clean, consistent icon set |

> [!IMPORTANT]
> **Architecture**: Next.js App Router with Server Components for data fetching, Client Components for interactivity, and Route Handlers (`/api/...`) for mutations. Prisma handles all DB access. ngrok tunnels the local dev server for external access.

---

## Database Schema (Prisma)

```prisma
// schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(FLEET_MANAGER)
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("users")
}

enum Role {
  FLEET_MANAGER
  DRIVER
  SAFETY_OFFICER
  FINANCIAL_ANALYST
}

model Vehicle {
  id                 Int      @id @default(autoincrement())
  registrationNumber String   @unique @map("registration_number")
  nameModel          String   @map("name_model")
  type               VehicleType
  maxLoadCapacityKg  Float    @map("max_load_capacity_kg")
  odometerKm         Float    @default(0) @map("odometer_km")
  acquisitionCost    Float    @map("acquisition_cost")
  status             VehicleStatus @default(AVAILABLE)
  region             String?
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  trips           Trip[]
  maintenanceLogs MaintenanceLog[]
  fuelLogs        FuelLog[]
  expenses        Expense[]

  @@map("vehicles")
}

enum VehicleType {
  TRUCK
  VAN
  CAR
  BUS
}

enum VehicleStatus {
  AVAILABLE
  ON_TRIP
  IN_SHOP
  RETIRED
}

model Driver {
  id              Int          @id @default(autoincrement())
  name            String
  licenseNumber   String       @unique @map("license_number")
  licenseCategory String       @map("license_category")
  licenseExpiry   DateTime     @map("license_expiry")
  contactNumber   String       @map("contact_number")
  safetyScore     Float        @default(100.0) @map("safety_score")
  status          DriverStatus @default(AVAILABLE)
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  trips Trip[]

  @@map("drivers")
}

enum DriverStatus {
  AVAILABLE
  ON_TRIP
  OFF_DUTY
  SUSPENDED
}

model Trip {
  id                 Int        @id @default(autoincrement())
  vehicleId          Int        @map("vehicle_id")
  driverId           Int        @map("driver_id")
  source             String
  destination        String
  cargoWeightKg      Float      @map("cargo_weight_kg")
  distanceKm         Float      @map("distance_km")
  revenue            Float      @default(0)
  status             TripStatus @default(DRAFT)
  finalOdometer      Float?     @map("final_odometer")
  fuelConsumedLiters Float?     @map("fuel_consumed_liters")
  createdAt          DateTime   @default(now()) @map("created_at")
  dispatchedAt       DateTime?  @map("dispatched_at")
  completedAt        DateTime?  @map("completed_at")

  vehicle  Vehicle   @relation(fields: [vehicleId], references: [id])
  driver   Driver    @relation(fields: [driverId], references: [id])
  fuelLogs FuelLog[]
  expenses Expense[]

  @@map("trips")
}

enum TripStatus {
  DRAFT
  DISPATCHED
  COMPLETED
  CANCELLED
}

model MaintenanceLog {
  id          Int               @id @default(autoincrement())
  vehicleId   Int               @map("vehicle_id")
  type        MaintenanceType
  description String?           @db.Text
  cost        Float             @default(0)
  status      MaintenanceStatus @default(OPEN)
  createdAt   DateTime          @default(now()) @map("created_at")
  closedAt    DateTime?         @map("closed_at")

  vehicle Vehicle @relation(fields: [vehicleId], references: [id])

  @@map("maintenance_logs")
}

enum MaintenanceType {
  OIL_CHANGE
  TIRE_REPLACEMENT
  ENGINE_REPAIR
  BRAKE_SERVICE
  GENERAL
}

enum MaintenanceStatus {
  OPEN
  CLOSED
}

model FuelLog {
  id             Int      @id @default(autoincrement())
  vehicleId      Int      @map("vehicle_id")
  tripId         Int?     @map("trip_id")
  liters         Float
  costPerLiter   Float    @map("cost_per_liter")
  totalCost      Float    @map("total_cost")
  odometerAtFill Float    @map("odometer_at_fill")
  date           DateTime
  createdAt      DateTime @default(now()) @map("created_at")

  vehicle Vehicle @relation(fields: [vehicleId], references: [id])
  trip    Trip?   @relation(fields: [tripId], references: [id])

  @@map("fuel_logs")
}

model Expense {
  id          Int             @id @default(autoincrement())
  vehicleId   Int             @map("vehicle_id")
  tripId      Int?            @map("trip_id")
  category    ExpenseCategory
  description String?         @db.Text
  amount      Float
  date        DateTime
  createdAt   DateTime        @default(now()) @map("created_at")

  vehicle Vehicle @relation(fields: [vehicleId], references: [id])
  trip    Trip?   @relation(fields: [tripId], references: [id])

  @@map("expenses")
}

enum ExpenseCategory {
  TOLL
  MAINTENANCE
  FUEL
  INSURANCE
  MISC
}
```

**ER Diagram:**

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        enum role
    }

    VEHICLES {
        int id PK
        string registration_number UK
        string name_model
        enum type
        float max_load_capacity_kg
        float odometer_km
        float acquisition_cost
        enum status
        string region
    }

    DRIVERS {
        int id PK
        string name
        string license_number UK
        string license_category
        datetime license_expiry
        string contact_number
        float safety_score
        enum status
    }

    TRIPS {
        int id PK
        int vehicle_id FK
        int driver_id FK
        string source
        string destination
        float cargo_weight_kg
        float distance_km
        float revenue
        enum status
        float final_odometer
        float fuel_consumed_liters
    }

    MAINTENANCE_LOGS {
        int id PK
        int vehicle_id FK
        enum type
        string description
        float cost
        enum status
    }

    FUEL_LOGS {
        int id PK
        int vehicle_id FK
        int trip_id FK
        float liters
        float cost_per_liter
        float total_cost
    }

    EXPENSES {
        int id PK
        int vehicle_id FK
        int trip_id FK
        enum category
        float amount
    }

    VEHICLES ||--o{ TRIPS : "assigned to"
    DRIVERS ||--o{ TRIPS : "drives"
    VEHICLES ||--o{ MAINTENANCE_LOGS : "has"
    VEHICLES ||--o{ FUEL_LOGS : "consumes"
    VEHICLES ||--o{ EXPENSES : "incurs"
    TRIPS ||--o{ FUEL_LOGS : "during"
    TRIPS ||--o{ EXPENSES : "during"
```

---

## Page-by-Page Task Breakdown

Each page below is a self-contained module with its own frontend view, API routes, and business logic.

---

### Page 0: Project Scaffolding & Foundation

> Set up the entire Next.js project, database, Prisma, design system, and shared utilities.

| # | Task | Details |
|---|---|---|
| 0.1 | **Initialize Next.js project** | `npx create-next-app@latest ./` with App Router, no Tailwind, src directory, import aliases |
| 0.2 | **Install dependencies** | `prisma`, `@prisma/client`, `next-auth`, `bcryptjs`, `lucide-react`, `chart.js`, `react-chartjs-2`, `jspdf`, `jspdf-autotable` |
| 0.3 | **Configure Prisma** | `npx prisma init`, set MySQL connection URL in `.env`, create full schema, run `npx prisma db push` |
| 0.4 | **Prisma client singleton** | `src/lib/prisma.js` — Singleton pattern to avoid multiple client instances in dev |
| 0.5 | **Seed script** | `prisma/seed.js` — Seed users, vehicles, drivers, trips, maintenance, fuel logs, expenses |
| 0.6 | **Design system (CSS)** | `src/app/globals.css` — Tailwind CSS v4 `@theme` configuration, color tokens, dark mode variables, custom animations |
| 0.7 | **Root layout** | `src/app/layout.js` — HTML shell, font loading (Inter from Google Fonts), metadata, theme provider |
| 0.8 | **Shared components** | `src/components/` — Sidebar, Header, Toast, Modal, ConfirmDialog, DataTable (sort/filter/paginate), StatCard, StatusBadge |
| 0.9 | **Utility helpers** | `src/lib/utils.js` — Date formatters, currency formatters, CSV export, validation helpers |
| 0.10 | **ngrok setup** | Document ngrok tunnel command: `ngrok http 3000` |

**Deliverable:** [✅ DONE] Running Next.js app with Tailwind v4 design system, initialized MySQL database with seed data, and ngrok-ready.

---

### Page 1: Authentication & RBAC

> Secure login page with NextAuth.js credentials provider and role-based middleware protection.

| # | Task | Details |
|---|---|---|
| 1.1 | **NextAuth configuration** | `src/app/api/auth/[...nextauth]/route.js` — Credentials provider, bcrypt password check, include role in session/JWT |
| 1.2 | **Auth middleware** | `src/middleware.js` — Protect all routes except `/login` and `/api/auth`; redirect unauthenticated users |
| 1.3 | **Login page UI** | `src/app/login/page.js` — Client component with email/password form, animated gradient background, error feedback, loading state |
| 1.4 | **Session provider** | `src/components/providers/SessionProvider.js` — Wrap app with NextAuth SessionProvider |
| 1.5 | **Role-based nav** | Sidebar dynamically shows/hides menu items based on `session.user.role` |
| 1.6 | **API route protection helper** | `src/lib/auth.js` — `getServerSession()` wrapper + `authorize(...roles)` utility for API routes |
| 1.7 | **Seed users** | 4 users (one per role) with bcrypt-hashed passwords |

**Business Rules Enforced:**
- Only authenticated users access the app (middleware redirects to `/login`)
- Each API route checks session + role before processing
- Session expires after 8 hours

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| POST | `/api/auth/[...nextauth]` | Public | NextAuth login handler |
| GET | `/api/auth/session` | Public | Get current session |

---

### Page 2: Dashboard (KPI Overview)

> Landing page after login showing real-time fleet KPIs with filters and mini charts.

| # | Task | Details |
|---|---|---|
| 2.1 | **Dashboard page** | `src/app/dashboard/page.js` — Server component that fetches KPIs |
| 2.2 | **KPI stat cards** | Active Vehicles, Available Vehicles, Vehicles In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization % |
| 2.3 | **KPI API route** | `src/app/api/dashboard/route.js` — Prisma aggregation queries across vehicles, drivers, trips |
| 2.4 | **Filter bar** | Client component: filter KPIs by vehicle type, status, and region |
| 2.5 | **Mini charts** | Trip volume (last 7 days bar chart), Vehicle status distribution (doughnut), Fleet utilization trend (line) — using `react-chartjs-2` |
| 2.6 | **Recent activity feed** | Last 10 events (trips dispatched, maintenance created, etc.) |

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/dashboard` | All | Aggregated KPI data |
| GET | `/api/dashboard/activity` | All | Recent activity feed |

---

### Page 3: Vehicle Registry

> Full CRUD for the vehicle master list with status management.

| # | Task | Details |
|---|---|---|
| 3.1 | **Vehicle list page** | `src/app/vehicles/page.js` — Sortable, filterable DataTable with status badges, search by registration/name |
| 3.2 | **Add/Edit vehicle modal** | Client component: Registration Number, Name/Model, Type (dropdown), Max Load Capacity, Odometer, Acquisition Cost, Region, Status |
| 3.3 | **Vehicle detail page** | `src/app/vehicles/[id]/page.js` — Full vehicle info, linked trips, maintenance history, fuel logs, total expenses |
| 3.4 | **Vehicle API routes** | `src/app/api/vehicles/route.js` (GET list, POST create), `src/app/api/vehicles/[id]/route.js` (GET, PUT, DELETE) |
| 3.5 | **Registration uniqueness** | Prisma `@unique` constraint + API try/catch on P2002 error with user-friendly message |
| 3.6 | **Status management** | Status can only be manually set to Available or Retired; On Trip and In Shop are system-managed |
| 3.7 | **Retire vehicle** | Action button to mark as Retired (with confirmation dialog); retired vehicles excluded from dispatch |
| 3.8 | **Available vehicles endpoint** | `src/app/api/vehicles/available/route.js` — Only returns `status = AVAILABLE` vehicles |

**Business Rules Enforced:**
- ✅ Registration numbers are strictly unique (Prisma constraint + API error handling)
- ✅ Retired / In Shop vehicles never appear in dispatch selection
- ✅ Manual status changes limited to Available ↔ Retired only

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/vehicles` | All | List all vehicles (with query filters) |
| POST | `/api/vehicles` | Fleet Manager | Create vehicle |
| GET | `/api/vehicles/[id]` | All | Get vehicle details with relations |
| PUT | `/api/vehicles/[id]` | Fleet Manager | Update vehicle |
| DELETE | `/api/vehicles/[id]` | Fleet Manager | Soft delete / deactivate vehicle |
| GET | `/api/vehicles/available` | All | Vehicles available for dispatch |

---

### Page 4: Driver Management

> Driver profiles with license tracking and safety scores.

| # | Task | Details |
|---|---|---|
| 4.1 | **Driver list page** | `src/app/drivers/page.js` — DataTable with status badges, safety score color coding, search by name/license |
| 4.2 | **Add/Edit driver modal** | Form: Name, License Number, License Category, License Expiry (date picker), Contact Number, Safety Score, Status |
| 4.3 | **Driver detail page** | `src/app/drivers/[id]/page.js` — Full profile, linked trips, license expiry warning, performance stats |
| 4.4 | **Driver API routes** | `src/app/api/drivers/route.js`, `src/app/api/drivers/[id]/route.js` — Full CRUD |
| 4.5 | **License expiry check** | Visual warning badge for licenses expiring within 30 days; block assignment if expired |
| 4.6 | **Status management** | Manual: Available ↔ Off Duty ↔ Suspended; System-managed: On Trip |
| 4.7 | **Available drivers endpoint** | `src/app/api/drivers/available/route.js` — Only `status = AVAILABLE` and `license_expiry >= today` |

**Business Rules Enforced:**
- ✅ Drivers with expired licenses cannot be assigned to trips
- ✅ Suspended drivers cannot be assigned to trips
- ✅ Drivers currently "On Trip" cannot be assigned to another trip

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/drivers` | All | List all drivers (with filters) |
| POST | `/api/drivers` | Fleet Manager, Safety Officer | Create driver |
| GET | `/api/drivers/[id]` | All | Get driver details |
| PUT | `/api/drivers/[id]` | Fleet Manager, Safety Officer | Update driver |
| DELETE | `/api/drivers/[id]` | Fleet Manager | Delete driver |
| GET | `/api/drivers/available` | All | Drivers eligible for dispatch |

---

### Page 5: Trip Management

> Trip lifecycle management with full validation pipeline.

| # | Task | Details |
|---|---|---|
| 5.1 | **Trip list page** | `src/app/trips/page.js` — DataTable with status pipeline badges (Draft → Dispatched → Completed/Cancelled), filters by status/date |
| 5.2 | **Create trip form** | `src/app/trips/new/page.js` — Source, Destination, Vehicle (dropdown — only Available), Driver (dropdown — only Available + valid license), Cargo Weight, Distance, Revenue |
| 5.3 | **Cargo validation** | Real-time: when vehicle selected, display max capacity; block submit if cargo > capacity. Server-side double-check. |
| 5.4 | **Dispatch action** | API: Draft → Dispatched; Prisma transaction updates trip + vehicle status + driver status to "On Trip" |
| 5.5 | **Complete trip modal** | Client component: Final Odometer Reading, Fuel Consumed (liters); Dispatched → Completed; restores vehicle + driver to "Available" |
| 5.6 | **Cancel trip action** | Dispatched/Draft → Cancelled; if was Dispatched, restores vehicle + driver to "Available" |
| 5.7 | **Trip detail page** | `src/app/trips/[id]/page.js` — Full trip info, linked fuel/expense records, action buttons |
| 5.8 | **Trip API routes** | `src/app/api/trips/route.js`, `src/app/api/trips/[id]/route.js`, `src/app/api/trips/[id]/dispatch/route.js`, `src/app/api/trips/[id]/complete/route.js`, `src/app/api/trips/[id]/cancel/route.js` |

**Business Rules Enforced:**
- ✅ Only Available vehicles appear in dispatch dropdown
- ✅ Only Available drivers with valid (non-expired) licenses appear
- ✅ Cargo weight ≤ vehicle's max load capacity (validated server-side)
- ✅ Dispatching → vehicle & driver status = "On Trip" (Prisma transaction)
- ✅ Completing/Cancelling → vehicle & driver status = "Available" (Prisma transaction)
- ✅ On Trip vehicles/drivers cannot be double-assigned

**Trip Lifecycle State Machine:**

```mermaid
stateDiagram-v2
    [*] --> Draft: Create Trip
    Draft --> Dispatched: Dispatch
    Draft --> Cancelled: Cancel
    Dispatched --> Completed: Complete (enter odometer + fuel)
    Dispatched --> Cancelled: Cancel
    Completed --> [*]
    Cancelled --> [*]

    note right of Dispatched: Vehicle & Driver → "ON_TRIP"
    note right of Completed: Vehicle & Driver → "AVAILABLE"
    note right of Cancelled: Vehicle & Driver → "AVAILABLE" (if was Dispatched)
```

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/trips` | All | List all trips (with filters) |
| POST | `/api/trips` | Fleet Manager, Driver | Create trip (Draft) |
| GET | `/api/trips/[id]` | All | Get trip details with relations |
| PUT | `/api/trips/[id]` | Fleet Manager | Update trip details |
| PATCH | `/api/trips/[id]/dispatch` | Fleet Manager | Dispatch trip |
| PATCH | `/api/trips/[id]/complete` | Fleet Manager, Driver | Complete trip |
| PATCH | `/api/trips/[id]/cancel` | Fleet Manager | Cancel trip |

---

### Page 6: Maintenance Management

> Maintenance records with automatic vehicle status transitions.

| # | Task | Details |
|---|---|---|
| 6.1 | **Maintenance list page** | `src/app/maintenance/page.js` — DataTable with Open/Closed status, linked vehicle info, cost summary |
| 6.2 | **Create maintenance modal** | Form: Vehicle (dropdown), Type (Oil Change, Tire, Engine, Brake, General), Description, Cost |
| 6.3 | **Auto status: Open** | Prisma transaction: insert record + vehicle status → IN_SHOP |
| 6.4 | **Close maintenance action** | Prisma transaction: update record status → CLOSED + vehicle status → AVAILABLE (unless RETIRED) |
| 6.5 | **Auto-create expense** | Creating a maintenance record also inserts an Expense (category = MAINTENANCE) |
| 6.6 | **Maintenance API routes** | `src/app/api/maintenance/route.js`, `src/app/api/maintenance/[id]/route.js`, `src/app/api/maintenance/[id]/close/route.js` |

**Business Rules Enforced:**
- ✅ Creating maintenance record → vehicle status = "IN_SHOP" (Prisma transaction)
- ✅ Closing maintenance → vehicle status = "AVAILABLE" (unless RETIRED)
- ✅ In Shop vehicles hidden from dispatch selection

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/maintenance` | All | List maintenance records |
| POST | `/api/maintenance` | Fleet Manager | Create record (→ IN_SHOP) |
| GET | `/api/maintenance/[id]` | All | Get record details |
| PATCH | `/api/maintenance/[id]/close` | Fleet Manager | Close record (→ AVAILABLE) |

---

### Page 7: Fuel & Expense Tracking

> Record fuel logs and operational expenses per vehicle/trip.

| # | Task | Details |
|---|---|---|
| 7.1 | **Fuel & Expenses page** | `src/app/fuel-expenses/page.js` — Tabbed view: Fuel Logs tab + Expenses tab |
| 7.2 | **Fuel log list** | DataTable with vehicle, trip link, liters, cost, date |
| 7.3 | **Add fuel log modal** | Vehicle (dropdown), Trip (optional dropdown), Liters, Cost per Liter (auto-compute total), Odometer at Fill, Date |
| 7.4 | **Expense list** | DataTable with category badges, vehicle, trip link, amount |
| 7.5 | **Add expense modal** | Vehicle, Trip (optional), Category (Toll, Maintenance, Fuel, Insurance, Misc), Description, Amount, Date |
| 7.6 | **Per-vehicle cost summary** | Card/sidebar showing total fuel cost, total expenses, cost breakdown by category |
| 7.7 | **API routes** | `src/app/api/fuel-logs/route.js`, `src/app/api/expenses/route.js` |

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/fuel-logs` | All | List fuel logs |
| POST | `/api/fuel-logs` | Fleet Manager, Driver | Create fuel log |
| GET | `/api/expenses` | All | List expenses |
| POST | `/api/expenses` | Fleet Manager, Financial Analyst | Create expense |
| GET | `/api/vehicles/[id]/costs` | All | Total cost breakdown for vehicle |

---

### Page 8: Reports & Analytics

> Charts, tables, and exportable reports for operational insights.

| # | Task | Details |
|---|---|---|
| 8.1 | **Reports page** | `src/app/reports/page.js` — Tabbed layout: Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI |
| 8.2 | **Fuel Efficiency report** | Bar chart: km/liter per vehicle; Line chart: fleet average trend over time |
| 8.3 | **Fleet Utilization report** | Stacked bar: % time each vehicle on trip vs idle; Gauge: overall utilization |
| 8.4 | **Operational Cost report** | Doughnut: cost breakdown by category; Horizontal bar: cost per vehicle; Line: monthly trend |
| 8.5 | **Vehicle ROI report** | Table: per-vehicle ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost; color-coded profitability |
| 8.6 | **Date range filter** | All reports filterable by custom date range |
| 8.7 | **CSV export** | Button to export any report table to downloadable CSV file |
| 8.8 | **PDF export (bonus)** | Generate PDF report with charts + tables using jsPDF |
| 8.9 | **Reports API routes** | `src/app/api/reports/route.js` — Prisma raw queries / aggregations for each report type |

**ROI Formula:**

$$\text{Vehicle ROI} = \frac{\text{Revenue} - (\text{Maintenance Cost} + \text{Fuel Cost})}{\text{Acquisition Cost}}$$

**API Routes:**

| Method | Route | Roles | Description |
|---|---|---|---|
| GET | `/api/reports/fuel-efficiency` | All | Fuel efficiency data |
| GET | `/api/reports/fleet-utilization` | All | Utilization data |
| GET | `/api/reports/operational-cost` | All | Cost breakdown data |
| GET | `/api/reports/vehicle-roi` | All | ROI per vehicle |

---

### Page 9: Settings & User Management (Bonus)

| # | Task | Details |
|---|---|---|
| 9.1 | **Settings page** | `src/app/settings/page.js` |
| 9.2 | **User profile** | View/edit own profile, change password |
| 9.3 | **User management** | Fleet Manager can create/edit/disable users and assign roles |
| 9.4 | **Dark mode toggle** | Persisted in localStorage, CSS custom property swap via `data-theme` attribute on `<html>` |

---

## Execution Order & Dependencies

The pages must be built in this order due to data dependencies:

```mermaid
graph TD
    P0["Page 0: Scaffolding & Foundation"] --> P1["Page 1: Auth & RBAC"]
    P1 --> P2["Page 2: Dashboard"]
    P1 --> P3["Page 3: Vehicle Registry"]
    P1 --> P4["Page 4: Driver Management"]
    P3 --> P5["Page 5: Trip Management"]
    P4 --> P5
    P3 --> P6["Page 6: Maintenance"]
    P3 --> P7["Page 7: Fuel & Expenses"]
    P5 --> P7
    P5 --> P8["Page 8: Reports & Analytics"]
    P6 --> P8
    P7 --> P8
    P8 --> P2
    P1 --> P9["Page 9: Settings (Bonus)"]

    style P0 fill:#1a1a2e,stroke:#e94560,color:#fff
    style P1 fill:#1a1a2e,stroke:#e94560,color:#fff
    style P2 fill:#16213e,stroke:#0f3460,color:#fff
    style P3 fill:#16213e,stroke:#0f3460,color:#fff
    style P4 fill:#16213e,stroke:#0f3460,color:#fff
    style P5 fill:#0f3460,stroke:#533483,color:#fff
    style P6 fill:#0f3460,stroke:#533483,color:#fff
    style P7 fill:#0f3460,stroke:#533483,color:#fff
    style P8 fill:#533483,stroke:#e94560,color:#fff
    style P9 fill:#533483,stroke:#e94560,color:#fff
```

---

## Folder Structure

```
odoo-2026/
├── prisma/
│   ├── schema.prisma             # Full database schema
│   └── seed.js                   # Seed script for demo data
├── src/
│   ├── app/
│   │   ├── layout.js             # Root layout (sidebar, header, providers)
│   │   ├── globals.css           # Full design system + dark mode
│   │   ├── page.js               # Redirect to /dashboard
│   │   ├── login/
│   │   │   └── page.js           # Login page
│   │   ├── dashboard/
│   │   │   └── page.js           # KPI dashboard
│   │   ├── vehicles/
│   │   │   ├── page.js           # Vehicle list
│   │   │   └── [id]/
│   │   │       └── page.js       # Vehicle detail
│   │   ├── drivers/
│   │   │   ├── page.js           # Driver list
│   │   │   └── [id]/
│   │   │       └── page.js       # Driver detail
│   │   ├── trips/
│   │   │   ├── page.js           # Trip list
│   │   │   ├── new/
│   │   │   │   └── page.js       # Create trip form
│   │   │   └── [id]/
│   │   │       └── page.js       # Trip detail
│   │   ├── maintenance/
│   │   │   └── page.js           # Maintenance records
│   │   ├── fuel-expenses/
│   │   │   └── page.js           # Fuel & expense tracking
│   │   ├── reports/
│   │   │   └── page.js           # Reports & analytics
│   │   ├── settings/
│   │   │   └── page.js           # Settings (bonus)
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.js  # NextAuth handler
│   │       ├── dashboard/
│   │       │   ├── route.js      # KPI aggregations
│   │       │   └── activity/
│   │       │       └── route.js  # Recent activity
│   │       ├── vehicles/
│   │       │   ├── route.js      # List + Create
│   │       │   ├── available/
│   │       │   │   └── route.js  # Available for dispatch
│   │       │   └── [id]/
│   │       │       ├── route.js  # Get + Update + Delete
│   │       │       └── costs/
│   │       │           └── route.js # Cost breakdown
│   │       ├── drivers/
│   │       │   ├── route.js      # List + Create
│   │       │   ├── available/
│   │       │   │   └── route.js  # Available for dispatch
│   │       │   └── [id]/
│   │       │       └── route.js  # Get + Update + Delete
│   │       ├── trips/
│   │       │   ├── route.js      # List + Create
│   │       │   └── [id]/
│   │       │       ├── route.js  # Get + Update
│   │       │       ├── dispatch/
│   │       │       │   └── route.js
│   │       │       ├── complete/
│   │       │       │   └── route.js
│   │       │       └── cancel/
│   │       │           └── route.js
│   │       ├── maintenance/
│   │       │   ├── route.js      # List + Create
│   │       │   └── [id]/
│   │       │       ├── route.js  # Get
│   │       │       └── close/
│   │       │           └── route.js
│   │       ├── fuel-logs/
│   │       │   └── route.js      # List + Create
│   │       ├── expenses/
│   │       │   └── route.js      # List + Create
│   │       └── reports/
│   │           ├── fuel-efficiency/
│   │           │   └── route.js
│   │           ├── fleet-utilization/
│   │           │   └── route.js
│   │           ├── operational-cost/
│   │           │   └── route.js
│   │           └── vehicle-roi/
│   │               └── route.js
│   ├── components/
│   │   ├── providers/
│   │   │   └── SessionProvider.js
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── ui/
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── Button.tsx
│   │   └── charts/
│   │       ├── BarChart.js
│   │       ├── DoughnutChart.js
│   │       └── LineChart.js
│   └── lib/
│       ├── prisma.js              # Prisma client singleton
│       ├── auth.js                # NextAuth config + helpers
│       └── utils.js               # Formatters, validators, CSV export
├── .env                           # DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
├── .env.example                   # Template for env vars
├── middleware.js                   # NextAuth route protection
├── package.json
├── next.config.js
└── README.md
```

---

## Business Rules Traceability Matrix

Every mandatory business rule mapped to where it is enforced:

| # | Business Rule | Prisma/API Enforcement | Frontend Enforcement |
|---|---|---|---|
| BR1 | Vehicle registration numbers must be unique | `@unique` constraint + catch Prisma P2002 error | Form shows error toast |
| BR2 | Retired/In Shop vehicles hidden from dispatch | `/api/vehicles/available` filters `status: "AVAILABLE"` | Dropdown only shows available vehicles |
| BR3 | Expired-license drivers blocked from trips | API validates `licenseExpiry >= new Date()` | Dropdown filters + warning badge |
| BR4 | Suspended drivers blocked from trips | API validates `status !== "SUSPENDED"` | Dropdown only shows available drivers |
| BR5 | On Trip vehicles/drivers can't be reassigned | API validates `status !== "ON_TRIP"` | Dropdown excludes On Trip entries |
| BR6 | Cargo weight ≤ max load capacity | API: `cargoWeightKg <= vehicle.maxLoadCapacityKg` | Real-time validation on vehicle select |
| BR7 | Dispatch → vehicle & driver = "ON_TRIP" | Prisma `$transaction`: update trip + vehicle + driver | UI refreshes status badges |
| BR8 | Complete/Cancel → vehicle & driver = "AVAILABLE" | Prisma `$transaction`: update trip + vehicle + driver | UI refreshes status badges |
| BR9 | Create maintenance → vehicle = "IN_SHOP" | Prisma `$transaction`: insert record + update vehicle | Vehicle hidden from dispatch |
| BR10 | Close maintenance → vehicle = "AVAILABLE" (unless Retired) | Prisma `$transaction`: update record + conditional vehicle update | UI refreshes status |

---

## Seed Data (via `prisma/seed.js`)

| Entity | Seed Records |
|---|---|
| Users | 4 users: `admin@transitops.com` (Fleet Manager), `driver@transitops.com` (Driver), `safety@transitops.com` (Safety Officer), `finance@transitops.com` (Financial Analyst). Password: `TransitOps@123` |
| Vehicles | 8 vehicles: mix of Truck, Van, Car, Bus across regions (North, South, East, West) with varied statuses |
| Drivers | 6 drivers: mix of statuses, one with expired license, one suspended |
| Trips | 10 trips: covering all statuses (Draft, Dispatched, Completed, Cancelled) |
| Maintenance | 4 records: 2 open (vehicles in IN_SHOP), 2 closed |
| Fuel Logs | 8 logs across different vehicles and trips |
| Expenses | 12 expenses across all categories |

---

## MySQL + ngrok Setup

### Prerequisites

```bash
# 1. MySQL running locally (e.g., XAMPP, MySQL Workbench, or standalone)
#    Create database:
mysql -u root -p -e "CREATE DATABASE transitops;"

# 2. .env configuration
DATABASE_URL="mysql://root:password@localhost:3306/transitops"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 3. Push schema to database
npx prisma db push

# 4. Seed the database
npx prisma db seed

# 5. Start dev server
npm run dev

# 6. Expose via ngrok (in a separate terminal)
ngrok http 3000
# Copy the ngrok URL and update NEXTAUTH_URL if needed for auth callbacks
```

---

## Verification Plan

### Automated Testing

```bash
# Start dev server
npm run dev

# Test business rules via API (using curl or Postman):
# BR1: POST /api/vehicles with duplicate registration → expect 409
# BR2: GET /api/vehicles/available → only AVAILABLE vehicles
# BR3: Assign expired-license driver → expect 400
# BR4: Assign SUSPENDED driver → expect 400
# BR5: Assign ON_TRIP vehicle/driver → expect 400
# BR6: Cargo weight > max capacity → expect 400
# BR7: PATCH /api/trips/[id]/dispatch → verify vehicle + driver = ON_TRIP
# BR8: PATCH /api/trips/[id]/complete → verify vehicle + driver = AVAILABLE
# BR9: POST /api/maintenance → verify vehicle = IN_SHOP
# BR10: PATCH /api/maintenance/[id]/close → verify vehicle = AVAILABLE
```

### Manual Verification

- **Walk through the Example Workflow** (Steps 1–9 from the problem statement) end-to-end in the browser
- **Test RBAC**: Login as each role and verify menu visibility + API restrictions
- **Test responsive design**: Verify on mobile (375px), tablet (768px), and desktop (1440px)
- **Test dark mode**: Toggle and verify all pages render correctly
- **Test CSV/PDF export**: Download and verify data accuracy
- **Test ngrok**: Access the app via ngrok URL from another device
- **Test edge cases**: Empty states, validation messages, concurrent operations

---

## Open Questions

> [!IMPORTANT]
> **MySQL Credentials**: What are your local MySQL connection details? (host, port, username, password, database name). This is needed for the `.env` file.

> [!IMPORTANT]
> **NextAuth vs Custom Auth**: The plan uses **NextAuth.js** for authentication (industry-standard for Next.js). It handles sessions, JWT, CSRF protection out of the box. Is this acceptable, or do you prefer a fully custom JWT implementation?

> [!IMPORTANT]
> **Bonus Features Priority**: Which bonus features should be included in the initial build?
> - ✅ Charts & visual analytics *(included)*
> - ✅ Search/filters/sorting *(included)*
> - ✅ Dark mode *(included)*
> - ⬜ PDF export
> - ⬜ Email reminders for expiring licenses
> - ⬜ Vehicle document management
