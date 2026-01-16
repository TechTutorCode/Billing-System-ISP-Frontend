# ISP Billing System - Frontend

A production-ready React dashboard for managing ISP billing operations.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **TanStack Query (React Query)** - Data fetching
- **Zustand** - State management
- **Recharts** - Charts and analytics
- **Lucide React** - Icons

## Features

### Authentication
- Two-step login (Email/Password → OTP verification)
- JWT token management with automatic refresh
- Protected routes

### Dashboard
- Overview statistics (Customers, Subscriptions, Revenue, Routers)
- Revenue over time chart
- Subscription status breakdown

### Customers
- List customers with search
- Create new customers
- Edit customer information
- View customer details
- Status management (active, suspended, terminated)

### Packages
- List packages by router
- Create service packages (PPPoE, Static, Hotspot)
- Configure speed, price, and validity
- Sync packages to MikroTik routers

### Subscriptions
- Create subscriptions (Customer + Package)
- Manage subscription status (activate, suspend, resume, terminate)
- View subscription history
- Auto-renewal support

### Payments
- Record payments (M-PESA, Cash, Admin)
- Payment history
- Transaction tracking
- Auto-renewal on successful payment

### Routers
- List MikroTik routers
- View router status (online/offline)
- Monitor router connectivity
- Sync packages to routers

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── auth/             # Authentication pages
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (Sidebar, Navbar)
│   └── ui/          # Base UI components (Button, Input, etc.)
├── features/         # Feature modules
│   ├── customers/
│   ├── dashboard/
│   ├── packages/
│   ├── payments/
│   ├── routers/
│   └── subscriptions/
├── store/           # Zustand stores
├── utils/           # Utility functions
├── App.tsx          # Main app component with routing
└── main.ts          # Entry point
```

## API Integration

The frontend integrates with the FastAPI backend. All API calls are centralized in the `src/api/` directory.

### Authentication Flow

1. User enters email and password
2. Backend sends OTP to email
3. User enters OTP
4. Backend returns JWT access and refresh tokens
5. Tokens are stored in localStorage and Zustand store
6. Axios interceptor adds token to all requests
7. Token refresh happens automatically on 401 errors

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:8000)

## TODO

- [ ] Add payment backend integration (currently mocked)
- [ ] Add dashboard statistics backend integration (currently mocked)
- [ ] Implement pagination for large datasets
- [ ] Add export functionality (CSV, PDF)
- [ ] Add advanced filtering and sorting
- [ ] Implement real-time updates with WebSockets
- [ ] Add dark mode support
- [ ] Add unit and integration tests

## License

Proprietary - ISP Billing System
