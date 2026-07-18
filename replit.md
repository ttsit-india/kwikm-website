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
- **Runtime**: Node.js with Express.js (lightweight server on port 3000)
- **Language**: TypeScript with ESM modules via tsx
- **API Structure**: RESTful endpoints under `/api/` prefix, proxied from Vite
- **AI Chat**: OpenAI integration via Replit AI Integrations (KwikM AI chatbot)

The server handles the AI chat API (`/api/chat`) using OpenAI's streaming API with a solar energy domain-specific system prompt. Vite proxies `/api` requests to the Express server in development.

### Code Organization
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn + custom)
│   │   └── ChatWidget.tsx  # KwikM AI chat widget
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and API client
├── server/              # Express backend
│   └── index.ts         # Chat API server with OpenAI integration
└── attached_assets/     # Static assets (logos, images)
```

### Key Design Decisions

1. **Monorepo Structure**: Frontend and backend in same repo with shared TypeScript types, ensuring type safety across the stack.

2. **Schema-First Approach**: Drizzle schemas define both database structure and generate Zod validation schemas, reducing duplication.

3. **Component Library**: Using shadcn/ui provides accessible, customizable components that can be modified directly in the codebase.

4. **PDF Generation**: Client-side PDF generation using jsPDF for solar proposals, avoiding server-side processing overhead.

5. **Solar Calculator (Solar Mitra Style)**: SubsidyCalculator rebuilt with Solar Mitra-style form layout — free-form kW input, Select Brand dropdown, Inverter Type/Loan Type dropdowns, monthly bill input, state selection for residential subsidy. Calculation logic: residential ongrid=60k/kW, hybrid 3kW=82k/kW, hybrid 5kW+=70k/kW, commercial ongrid=50k/kW, commercial hybrid=65k/kW. Central subsidy: 1kW=30k, 2kW=60k, 3kW+=78k. State subsidy varies by state.

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
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI API base URL (auto-set by Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key (auto-set by Replit AI Integrations)