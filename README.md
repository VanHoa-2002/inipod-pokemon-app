# Inipod Pokemon App

A full-stack Pokemon browsing application built using Angular (frontend) and Node.js/Express (backend), powered by MongoDB. Users can browse, favorite, and view detailed stats of Pokemon.

---

## Setup & Running Instructions

### Prerequisites

- Node.js (>=18.x)
- MongoDB (local or Atlas)
- `npm` or `pnpm`
- Nx CLI: `npm install -g nx`

### 1. Clone the Repository

```bash
git clone https://github.com/VanHoa-2002/inipod-pokemon-app.git
cd inipod-pokemon-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file in source folder:

```env
MONGO_URI=mongodb_url_connect
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 4. Run the Project

#### Frontend

```bash
npx nx serve inipod-pokemon-app
```

#### Backend

```bash
npx nx serve api
```

App is available at:  
🔗 Frontend: `http://localhost:4200`  
🔗 Backend API: `http://localhost:3000/api`

---

## Implemented Features

### Authentication

- JWT login/logout
- Token stored in `localStorage`
- `HttpInterceptor` to attach tokens
- Route guard (`AuthGuard`) for protection

### Pokemon Features

- Fetch paginated list of Pokemon
- Favorite Pokemon
- Show full stats (HP, Attack, Defense, Speed)
- Type indicators and Legendary badge
- Responsive modal for detail view

### Carousel

- Home page shows video carousel for 4 Pokemon
- Top 10 Pokemon loaded from DB

### Documentation & UI

- `/documentary` page contains setup guide, features detail, api documents & environment configs
- `/policy` page contains basic policy
- `notfound` page 404 not found
- Fully responsive navigation bar & footer
- TailwindCSS used throughout
- Clean, mobile-friendly layout using grid/flexbox

---

## Folder Structure (Nx)

```
apps/
  inipod-pokemon-app/  --> Angular 17 Standalone frontend
  api/                 --> Express + Mongoose backend
libs/                 --> (Optional shared libraries)
```
