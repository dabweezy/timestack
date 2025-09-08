# Timestack - Luxury Watch Inventory Management

A modern Next.js application for managing luxury watch inventory, built with TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 📊 **Dashboard** - Overview of inventory, sales, and customer metrics
- 👥 **Customer Management** - Add, edit, and track customer information
- ⌚ **Stock Management** - Comprehensive watch inventory system
- 💰 **Sales Processing** - Handle sales transactions and orders
- 📋 **Order Tracking** - Monitor purchase and sale orders
- 📄 **PDF Generation** - Generate receipts and reports
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ✨ **Modern UI** - Apple-inspired design with smooth animations

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Heroicons
- **PDF Generation:** jsPDF
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd timestack-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── modals/            # Modal components
│   │   ├── BaseModal.tsx
│   │   ├── CustomerModal.tsx
│   │   ├── ModalManager.tsx
│   │   └── StockModal.tsx
│   └── pages/             # Page components
│       ├── CustomersPage.tsx
│       ├── DashboardPage.tsx
│       ├── OrdersPage.tsx
│       ├── SalesPage.tsx
│       └── StockPage.tsx
├── store/                 # State management
│   └── useAppStore.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── utils/                 # Utility functions
    ├── format.ts
    └── pdfGenerator.ts
```

## Key Components

### Dashboard
- Overview statistics and charts
- Recent orders and top products
- Quick action buttons

### Customer Management
- Add/edit customer information
- Search and filter customers
- Customer contact details and banking info

### Stock Management
- Watch inventory with detailed specifications
- Search and filter by brand, condition, etc.
- Pricing management (trade vs retail)

### Sales & Orders
- Process sales transactions
- Order tracking and status management
- PDF receipt generation

## Deployment on Vercel

This application is optimized for deployment on Vercel:

### Automatic Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Environment Variables

No environment variables are required for the basic functionality as the app uses client-side state management.

## Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment settings

## Development

### Adding New Features

1. **New Page**: Create component in `src/components/pages/` and add to navigation
2. **New Modal**: Create modal component and add to `ModalManager`
3. **State Management**: Update `useAppStore.ts` for new data types
4. **Types**: Add TypeScript definitions in `src/types/index.ts`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.