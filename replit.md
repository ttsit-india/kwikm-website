# KwikM - Financial Services & Solar Energy Platform

## Overview

KwikM is a full-stack web application that serves as a one-stop platform for financial services and solar energy solutions in India. The platform focuses on helping users access PM Surya Ghar Muft Bijli Yojana (government solar subsidy program), along with other financial products like bank accounts, credit cards, insurance, and loans. It includes a solar subsidy calculator, lead capture forms, and a franchise partner signup system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with pages in `client/src/pages/` and reusable components in `client/src/components/`. The UI uses a custom design system with CSS variables for theming, supporting both light and dark modes.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Development**: Hot module replacement via Vite middleware

The server handles API requests and serves the static frontend in production. Routes are registered in `server/routes.ts` with a clean separation between HTTP handling and business logic.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `db:push` command

Current database tables:
- `leads`: Stores contact form submissions (name, email, phone, message)
- `solar_proposals`: Stores solar installation proposal data (customer info, capacity, costs, subsidies)

### Code Organization
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn + custom)
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database operations
│   └── db.ts            # Database connection
└── shared/              # Shared code (schema, types)
```

### Key Design Decisions

1. **Monorepo Structure**: Frontend and backend in same repo with shared TypeScript types, ensuring type safety across the stack.

2. **Schema-First Approach**: Drizzle schemas define both database structure and generate Zod validation schemas, reducing duplication.

3. **Component Library**: Using shadcn/ui provides accessible, customizable components that can be modified directly in the codebase.

4. **PDF Generation**: Client-side PDF generation using jsPDF for solar proposals, avoiding server-side processing overhead.

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **pg**: Node.js PostgreSQL client library
- **drizzle-orm**: Type-safe ORM for database operations

### UI Framework
- **@radix-ui**: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **lucide-react**: Icon library

### Form & Validation
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@hookform/resolvers**: Zod integration for react-hook-form

### PDF Generation
- **jspdf**: Client-side PDF generation
- **jspdf-autotable**: Table formatting for jsPDF

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast bundler for production builds

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)