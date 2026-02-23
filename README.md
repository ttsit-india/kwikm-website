# Color-Wave Client

Color-Wave is a React-based frontend application for KwikM's solar energy and financial services platform.

## Architecture

This project is now a **client-only** application that connects to the separate `kwikm-api` NestJS backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running `kwikm-api` server on port 3000

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` file with your API URL if different from default.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The client will run on `http://localhost:5000`

## Backend Connection

This client connects to the `kwikm-api` backend running on port 3000. Make sure to:

1. Start the `kwikm-api` server first:
   ```bash
   cd ../kwikm-api
   npm run start:dev
   ```

2. Then start this client:
   ```bash
   npm run dev
   ```

## API Integration

The client uses a centralized API client (`src/lib/api.ts`) to communicate with the backend. All API calls are proxied through Vite's development server to handle CORS.

## Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Radix UI** - Component Library
- **React Query** - Data Fetching
- **Wouter** - Routing
- **Framer Motion** - Animations

## Project Structure

```
Color-Wave/
├── client/                 # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities & API client
│   │   └── main.tsx        # Entry point
│   └── index.html
├── attached_assets/        # Static assets
├── .env                    # Environment variables
└── vite.config.ts         # Vite configuration
```