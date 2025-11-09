# Airplane Flight Simulator

## Overview

This is a 3D free-flight airplane simulator built as a web application. The game allows players to control a cartoon-style airplane in an open sky environment, focusing on the pure joy of flying without enemies, scores, or objectives. The application features a full-stack architecture with React frontend using Three.js for 3D rendering and an Express backend with PostgreSQL database support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **3D Rendering:** Three.js via @react-three/fiber and @react-three/drei
- **Build Tool:** Vite with custom configuration for client-side bundling
- **UI Components:** Radix UI primitives with custom shadcn/ui components
- **Styling:** Tailwind CSS with custom theme configuration
- **State Management:** Zustand for global state (game phase, audio, flight data)

**Key Design Decisions:**

1. **3D Scene Management:** Uses React Three Fiber to integrate Three.js declaratively with React, allowing component-based 3D scene composition
   - Rationale: Provides better integration with React's lifecycle and state management
   - Alternative: Pure Three.js would offer more control but require manual lifecycle management

2. **Component Structure:**
   - `Game.tsx`: Main game logic, airplane controls, camera following
   - `Airplane.tsx`: Airplane 3D model built from geometric primitives
   - `Environment.tsx`: Sky, ground plane, lighting setup
   - `Clouds.tsx`: Procedurally generated cloud decorations
   - Rationale: Separation of concerns allows independent development and testing

3. **Input Handling:** Keyboard controls via @react-three/drei's KeyboardControls
   - Arrow keys for pitch/roll, W/S for speed, L for loop, B for barrel roll
   - Rationale: Provides abstraction over raw keyboard events with better React integration

4. **State Management Pattern:**
   - Zustand stores for: game phase, audio controls, flight data
   - Local React state for component-specific data
   - Rationale: Lightweight global state without Redux boilerplate, good TypeScript support

### Backend Architecture

**Technology Stack:**
- **Framework:** Express.js with TypeScript
- **Runtime:** Node.js with ES modules
- **Build Tool:** esbuild for production bundling
- **Development:** tsx for TypeScript execution

**Key Design Decisions:**

1. **Storage Abstraction Layer:**
   - Interface-based design (`IStorage`) with in-memory implementation (`MemStorage`)
   - Prepared for database integration but currently uses Map-based storage
   - Rationale: Allows swapping storage backends without changing business logic
   - Trade-off: Current implementation loses data on restart

2. **Development vs Production:**
   - Development: Vite middleware for HMR and instant updates
   - Production: Pre-built static files served by Express
   - Rationale: Fast development experience while maintaining simple production deployment

3. **API Structure:**
   - Routes prefixed with `/api` for clear separation from static assets
   - Logging middleware for request/response tracking
   - Rationale: Standard REST conventions with development-friendly debugging

### Data Storage Solutions

**Database Configuration:**
- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Provider:** Neon serverless database (@neondatabase/serverless)
- **Migration:** Drizzle Kit for schema management
- **Schema Location:** `shared/schema.ts` for type sharing between client/server

**Current Schema:**
- Users table with id, username, password fields
- Zod validation schemas for type-safe inserts

**Design Rationale:**
- Drizzle chosen for: TypeScript-first design, zero runtime overhead, SQL-like queries
- Alternative considered: Prisma (more features but heavier runtime)
- Neon serverless: Serverless PostgreSQL with connection pooling and edge compatibility
- Schema sharing: Enables full-stack type safety from database to UI

### External Dependencies

**Third-Party Services:**
- **Database:** Neon PostgreSQL (serverless, configured via DATABASE_URL environment variable)

**Key Libraries:**

1. **3D Rendering:**
   - `three` - Core 3D library
   - `@react-three/fiber` - React renderer for Three.js
   - `@react-three/drei` - Helper components (keyboard controls, camera utilities)
   - `@react-three/postprocessing` - Visual effects pipeline
   - `vite-plugin-glsl` - GLSL shader support

2. **UI Framework:**
   - `@radix-ui/*` - Headless UI primitives (30+ components)
   - `tailwindcss` - Utility-first CSS framework
   - `class-variance-authority` - Type-safe variant styling
   - `lucide-react` - Icon library

3. **State & Data:**
   - `zustand` - Lightweight state management
   - `@tanstack/react-query` - Server state management (configured but not actively used)
   - `zod` - Runtime type validation

4. **Database:**
   - `drizzle-orm` - TypeScript ORM
   - `@neondatabase/serverless` - Neon database driver
   - `drizzle-kit` - Migration tooling

5. **Development:**
   - `vite` - Fast build tool with HMR
   - `esbuild` - Production bundler
   - `tsx` - TypeScript execution for development

**Integration Notes:**
- Database URL must be provided via environment variable
- Asset loading configured for 3D models (.gltf, .glb) and audio files (.mp3, .ogg, .wav)
- Custom Vite plugin for runtime error overlay in Replit environment