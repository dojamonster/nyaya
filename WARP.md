# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Nyaya** is a women's safety and support platform consisting of a React frontend and an Express backend. The application provides a safe space for sharing experiences, connecting with communities, and accessing support resources related to workplace harassment, domestic violence, legal help, and campus safety issues.

## Essential Commands

### Frontend (Root Directory)
```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend (backend/)
```bash
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Development server with auto-reload (runs on http://localhost:3001)
npm run dev

# Production server
npm start
```

### Full Stack Development
Run both servers simultaneously in separate terminals:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend (from root)
npm run dev
```

## Architecture

### Monorepo Structure
This is a full-stack monorepo with frontend and backend colocated:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + SQLite + better-sqlite3
- **Communication**: REST API with CORS enabled

### Frontend Architecture

**Technology Stack:**
- Build tool: Vite with SWC plugin for fast compilation
- UI Framework: React 18 with React Router for routing
- State Management: @tanstack/react-query for server state
- UI Components: shadcn/ui (Radix UI primitives + Tailwind)
- Styling: Tailwind CSS with CSS variables for theming
- Forms: react-hook-form + zod for validation

**Key Patterns:**
1. **Path Aliases**: Use `@/` for imports (e.g., `@/components/ui/button`)
   - Configured in `vite.config.ts` and `tsconfig.json`
   - Maps to `./src/*`

2. **Component Structure**:
   - `src/components/`: Custom app components (Navigation, PostCard, CreatePost)
   - `src/components/ui/`: shadcn/ui primitives (button, card, dialog, etc.)
   - `src/pages/`: Route components (Home, Communities, Forum, Support, Profile)
   - `src/lib/`: Utilities (`cn()` for className merging)
   - `src/hooks/`: Custom React hooks

3. **Routing**: React Router v6 with BrowserRouter
   - All routes defined in `src/App.tsx`
   - Catch-all route for 404 handling
   - **Important**: Add custom routes ABOVE the `*` catch-all route

4. **UI Utilities**:
   - `cn()` function in `src/lib/utils.ts` merges Tailwind classes using clsx + tailwind-merge
   - Toast notifications via sonner + shadcn/ui toaster
   - Theming via next-themes with CSS variables

### Backend Architecture

**Technology Stack:**
- Framework: Express.js with ES modules (`"type": "module"`)
- Database: SQLite via better-sqlite3 (synchronous API)
- Security: bcrypt for password hashing, CORS for cross-origin requests
- Environment: dotenv for configuration

**API Structure:**
- Organized in route modules under `backend/routes/`:
  - `posts.js`: Post CRUD, likes, comments
  - `communities.js`: Community management, membership
  - `secureForum.js`: Password-protected posts
  - `users.js`: User profiles
- All routes prefixed with `/api/`
- Database initialized and seeded on server startup

**Database Schema:**
- **users**: User profiles, stats (posts_count, likes_received, etc.)
- **communities**: Pre-seeded with 4 communities (Workplace, Domestic Violence, Legal, College)
- **posts**: Main posts table with foreign keys to users and communities
- **post_tags**: Many-to-many for post tags
- **post_likes**: Tracks who liked which posts
- **comments**: Nested comments on posts
- **secure_posts**: Password-protected forum posts
- **user_communities**: Membership tracking

**Key Features:**
- Auto-initialization: Database and tables created on first run
- Transactions: Used for bulk inserts (e.g., tags)
- Prepared statements: All queries use prepared statements for safety
- Helper functions: `formatTimestamp()` for relative time formatting
- CORS: Configured for frontend URL (default: http://localhost:5173)

### API Integration Points

**Backend exposes these endpoints:**
- `GET /api/health` - Health check
- `GET /api/posts` - Get all posts with tags
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Toggle like
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/communities` - List communities
- `POST /api/communities/:id/join` - Join community
- `GET /api/secure-forum` - Get secure posts
- `POST /api/secure-forum` - Create secure post
- `GET /api/users/:id` - Get user profile

**Frontend currently uses dummy data but is structured for API integration.**

## Development Workflow

### Adding New Features

1. **New UI Component**:
   - Place in `src/components/` for app-specific components
   - Use shadcn/ui primitives from `src/components/ui/`
   - Import with `@/components/...` alias

2. **New Page/Route**:
   - Create file in `src/pages/`
   - Add route in `src/App.tsx` BEFORE the catch-all `*` route
   - Use Navigation component for consistent nav

3. **New API Endpoint**:
   - Add route in appropriate file under `backend/routes/`
   - Import and mount in `backend/server.js`
   - Update database schema in `backend/database.js` if needed
   - Remember to use prepared statements and transactions

4. **Database Changes**:
   - Modify `backend/database.js` `initDatabase()` function
   - Delete `backend/database.sqlite` to reset
   - Restart backend to recreate with new schema

### Code Style & Patterns

**Frontend:**
- Use TypeScript with relaxed settings (noImplicitAny: false, strictNullChecks: false)
- Functional components with hooks
- Use `cn()` for conditional className logic
- Prefer arrow function components: `const Component = () => {}`

**Backend:**
- ES modules with `.js` extension (not `.mjs`)
- Use `import`/`export`, not `require()`
- Synchronous database operations (better-sqlite3 API)
- Transaction wrappers for multi-row inserts
- Console logging for request tracking

### Special Considerations

**Panic Button Feature:**
- Navigation includes emergency exit button
- Double-click protection (3-second timeout)
- Redirects to Google for privacy

**User Anonymity:**
- Users identified by emoji avatars (🌸, 🦋, etc.)
- No real names required
- Anonymous posting supported

**Security:**
- Secure forum posts use bcrypt password hashing
- CORS restricted to frontend URL
- SQL injection prevented via prepared statements
- Foreign key constraints enabled

### Testing

**Frontend:**
- No test framework currently configured
- Manual testing via `npm run dev`
- Check browser console for errors

**Backend:**
- No test framework currently configured
- Test endpoints with curl or HTTP client:
  ```bash
  curl http://localhost:3001/api/health
  curl http://localhost:3001/api/posts
  ```
- Monitor backend terminal for request logs

### Environment Configuration

**Frontend (.env if needed):**
- Vite uses `VITE_` prefix for exposed env vars
- Default dev server: port 8080, host `::`

**Backend (backend/.env):**
```
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_PATH=./database.sqlite
NODE_ENV=development
```

## Important Notes

- **shadcn/ui**: Components are copied into codebase, not imported from package
  - Modify components directly in `src/components/ui/`
  - Use `components.json` for shadcn CLI configuration
  
- **Lovable Tagger**: Development plugin for component tagging (lovable-tagger)
  - Only runs in development mode
  - Can be ignored for normal development

- **Database Persistence**: SQLite file is in `backend/database.sqlite`
  - Not tracked in git (should be in .gitignore)
  - Reset by deleting file and restarting backend

- **CORS**: Backend defaults to `http://localhost:5173` for frontend
  - Update `FRONTEND_URL` if frontend port changes
  - Vite dev server runs on port 8080, not 5173

- **React Query**: Configured but not actively used yet
  - Set up in App.tsx for future API integration
  - Use for data fetching when integrating backend APIs
