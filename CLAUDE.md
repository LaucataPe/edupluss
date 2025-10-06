# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Edupluss is an employee training application built as a full-stack monorepo with separate API and client directories.

## Architecture

### Backend (api/)
- **Framework**: Express.js with Sequelize ORM
- **Database**: MySQL (configured in `api/src/db.js`)
- **Authentication**: JWT-based auth with Bearer tokens
  - Middleware: `api/src/Middlewares/verifyJWT.js` validates tokens on all routes except `/logUser`
  - Tokens stored in localStorage on client, passed via Authorization header
- **Structure**:
  - `api/src/models/` - Sequelize models (Activity, Area, Company, User, Role, Step, Review, TestGrade, etc.)
  - `api/src/controllers/` - Route handlers organized by domain (Activities, Areas, Company, Users, etc.)
  - `api/src/routes/index.js` - Centralized route definitions
  - `api/src/Middlewares/` - Authentication (verifyJWT) and authorization (verifyRole) middleware

### Frontend (educlient/)
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit with slices in `educlient/src/redux/features/`
  - Key slices: activitiesSlice, areaSlice, userSlice, roleSlice, stepsSlice, userStepsSlice, utilsSlice
- **UI Libraries**: PrimeReact, TailwindCSS, Framer Motion, Lucide React
- **Routing**: React Router (main routing in `educlient/src/App.tsx`)
- **Structure**:
  - `educlient/src/pages/` - Page components (Home, Activity, Dashboard, Progress, EvaluationList, etc.)
  - `educlient/src/components/` - Reusable components
  - `educlient/src/components/admin/` - Admin-specific components for managing activities, areas, roles, steps
  - `educlient/src/components/superAdmin/` - Super admin components for company-wide management
  - `educlient/src/utils/` - Utilities (validation, types, services, Cloudinary integration, axios interceptors)

### Key Domain Models
- **Company** - Organizations using the platform
- **Area** - Departments within a company
- **Role** - Job roles within areas
- **Activity** - Training activities/courses
- **Step** - Individual steps within an activity
- **User** - Employees (with roles) and admins
- **Review** - Activity reviews/ratings
- **TestGrade** - Evaluation scores for users on activities

### User Types & Access Control
- **Employee** (`tipo: "empleado"`) - Has a roleId, can access assigned training
- **Admin** (`tipo: "admin"`) - Company admin, manages activities/areas/roles for their company (roleId is null)
- **Super Admin** - Cross-company management capabilities

## Development Commands

### Backend (api/)
```bash
cd api
npm install
npm run dev    # Start development server with nodemon on port 3001
npm start      # Start production server
```

### Frontend (educlient/)
```bash
cd educlient
npm install
npm run dev      # Start Vite dev server
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Environment Configuration

### Backend (.env in api/)
Required variables:
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` - MySQL connection
- `JWT_SECRET` - JWT signing secret
- `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_KEY_SECRET` - Cloudinary config (optional)

### Database
- Run `npm run dev` in api/ - database syncs automatically via Sequelize on startup (force: false)
- Models auto-load from `api/src/models/` directory

## Important Implementation Notes

### Authentication Flow
1. User logs in via `/logUser` (unprotected route)
2. JWT token returned and stored in localStorage
3. All subsequent requests include `Authorization: Bearer <token>` header
4. verifyJWT middleware extracts userId, userRole, companyId from token and attaches to req object
5. verifyRole middleware checks authorization for specific actions

### State Management Pattern
- Redux slices use async thunks for API calls
- User state (userSlice) holds logged-in user info and companyId
- Activities filtered by company context from user state
- Areas fetched via `fetchCompanyAreas` thunk when company context changes

### Routing & Navigation
- Protected routes check token validity via axios interceptor
- Unauthenticated users redirected to login/landing
- Role-based UI rendering (admin vs employee views)
- Admin routes nested under `/admin/*`

### Activity & Step Workflow
- Activities belong to Companies and Areas
- Steps belong to Activities (ordered sequence)
- Users track progress via UserStep junction model
- TestGrade records evaluation results

## Main Branch

The main development branch is `develop` (not `main` or `master`).

## Testing

No test suite currently configured. When adding tests, update this section with test commands.
