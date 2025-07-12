# Inipod Pokemon App

A full-stack Pokémon browsing application built with **Angular 17 (Standalone)** for the frontend and **NestJS + PostgreSQL** for the backend. Users can register, log in, browse, favorite, and view detailed stats of Pokémon. Now powered by **NgRx** for state management and enhanced with **auth + password recovery** capabilities.

---

## ⚙️ Setup & Running Instructions

### ✅ Prerequisites

- Node.js (>=18.x)
- PostgreSQL (instead of MongoDB)
- `npm` or `pnpm`
- Nx CLI: `npm install -g nx`

---

### 1. Clone the Repository

```bash
git clone https://github.com/VanHoa-2002/inipod-pokemon-app.git
cd inipod-pokemon-app
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment

Create `.env` file in `apps/pokemon-backend/`:

```env
PORT=3000
# JWT Secret (sample only)
JWT_SECRET=your_jwt_secret_here
# PostgreSQL Configuration (sample only)
DB_HOST=your_db_host
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

```

> Replace with your actual PostgreSQL credentials.

---

### 4. Run the Project

#### 🚀 Frontend (Angular 17 + Standalone + NgRx)

```bash
npx nx serve inipod-pokemon-app
```

#### 🚀 Backend (NestJS + PostgreSQL)

```bash
npx nx serve pokemon-backend
```

> App will be available at:  
> 🔗 Frontend: `http://localhost:4200`  
> 🔗 Backend API: `http://localhost:3000/api`

---

## ✅ Implemented Features

### 🔐 Authentication

- ✅ JWT login/signup/logout with secure hashing
- ✅ Login using **email + password**
- ✅ `HttpInterceptor` automatically attaches JWT token
- ✅ `AuthGuard` protects private routes
- ✅ Password recovery API
- ✅ DTO validation (`class-validator`) and proper error handling

### 🌟 Pokémon Features

- ✅ Fetch all Pokémon with filters
- ✅ Favorite Pokémon management (toggle)
- ✅ Pokémon detail view (with types, stats, legendary status)
- ✅ Paginated list from database (CSV import supported)
- ✅ Filter by type, search by name, favorite view

### 🧠 State Management

- ✅ **NgRx** used to manage Auth state
- [WIP] Pokémon state via NgRx Store

### 🎠 Carousel (Homepage)

- ✅ Dynamic carousel showcasing top 4 Pokémon
- ✅ Top 10 Pokémon fetched from backend

### 📄 Documentation & Pages

- `/documentary`: Setup instructions, features list, API docs
- `/policy`: Simple policy page
- `/notfound`: 404 page with fallback navigation
- Fully responsive layout using **TailwindCSS**

---

## Folder Structure (Nx Monorepo)

```
apps/
  inipod-pokemon-app/    --> Angular 17 Frontend (Standalone Components)
  pokemon-backend/       --> NestJS Backend with PostgreSQL
libs/                    --> (Optional shared modules/services)
```

---

## 🔧 Tech Stack Summary

| Layer         | Stack                                     |
| ------------- | ----------------------------------------- |
| Frontend      | Angular 17, Standalone, TailwindCSS, NgRx |
| Backend       | NestJS, TypeORM, PostgreSQL               |
| Auth          | JWT, Bcrypt, Email-based login            |
| State Mgmt    | NgRx (Auth implemented)                   |
| Styling       | TailwindCSS                               |
| Data Source   | Pokémon CSV → PostgreSQL seed             |
| Monorepo Tool | Nx                                        |

---

## 🔗 Database Setup & Connection (PostgreSQL)

### 1. Install PostgreSQL

- Download and install PostgreSQL:  
  👉 https://www.postgresql.org/download/
- Remember your credentials:
  - **Username**: `postgres`
  - **Password**: `123123` (or the password configured in `.env`)

> 💡 Alternatively, you can use a cloud provider like [Supabase](https://supabase.com/) or [ElephantSQL](https://www.elephantsql.com/) if you prefer not to install locally.

---

### 2. Create a Database

Open pgAdmin or terminal:

```sql
CREATE DATABASE pokemon_db;
```

---

### 3. Environment Configuration

Create or update the `.env` file inside the `pokemon-backend/` folder:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123123
DB_DATABASE=pokemon_db
```

> Replace credentials as necessary depending on your local/cloud PostgreSQL setup.

---

### 4. Import Sample Data (Optional)

If a `.csv` file is provided for Pokémon data, you can import using this API:

```http
POST /api/pokemon/import
Content-Type: multipart/form-data
Body: file=<your_csv_file>
```

Or use a `.sql` dump if available:

```bash
psql -U postgres -d pokemon_db -f seed.sql
```

---

### 5. Start the Backend

```bash
npx nx serve pokemon-backend
```

Make sure the backend is running at:  
📍 `http://localhost:3000/api`

---

### ✅ Quick Checks

- Check database connection:

```bash
psql -U postgres -h localhost -d pokemon_db
```

- List tables:

```sql
\dt
```

- Test register API:

```http
POST /api/auth/signup
{
  "username": "tester",
  "email": "test@example.com",
  "password": "abc123"
}
```
