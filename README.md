# Compass - Enterprise-Grade Next.js Application

A full-stack web application demonstrating modern web development practices, built with Next.js 15 and TypeScript. This project showcases advanced frontend architecture, secure authentication, and scalable backend integration.

## Technical Highlights

### Modern Architecture
- **App Router & Server Components**: Leveraging Next.js 15's latest features for optimal performance and SEO
- **TypeScript**: Full type safety across the entire application
- **Server Actions**: Efficient server-side operations with type-safe API endpoints
- **Middleware Integration**: Advanced request handling and authentication flow

### Frontend 
- **Component Architecture**: Modular, reusable components using Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Efficient React hooks and context management
- **Animation**: Smooth transitions and interactions with Framer Motion
- **Accessibility**: WCAG-compliant components and semantic HTML

### Backend & Infrastructure
- **Authentication**: Secure user management with Supabase Auth
- **Database**: Real-time data synchronization with Supabase
- **API Integration**: RESTful endpoints with Axios
- **Payment Processing**: Secure transactions with Stripe
- **Environment Management**: Secure configuration with environment variables

### Development Practices
- **Code Quality**: ESLint and TypeScript for robust type checking
- **Performance**: Optimized builds with Turbopack
- **Testing**: Component and integration testing setup
- **CI/CD**: Ready for automated deployment pipelines
- **Version Control**: Git-based workflow with feature branching

## Tech Stack

### Core Technologies
- **Framework:** Next.js 15.3.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** React Hooks
- **API Integration:** Axios

### UI/UX
- **Component Library:** Radix UI
- **Icons:** Heroicons, Lucide React
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast, Sonner
- **Date Handling:** date-fns

### Backend & Services
- **Authentication:** Supabase Auth
- **Database:** Supabase
- **Payments:** Stripe
- **Markdown:** React Markdown

## Getting Started

1. Clone and setup:
```bash
git clone [repository-url]
cd compass
npm install
```

2. Configure environment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Development:
```bash
npm run dev     # Start development server with Turbopack
npm run build   # Production build
npm run lint    # Code quality check
```

## Project Structure

```
├── app/                    # Next.js app directory (App Router)
│   ├── api/               # Type-safe API routes
│   ├── (components)/      # Shared components
│   ├── actions/           # Server actions
│   ├── dashboard/         # Protected dashboard routes
│   └── auth/              # Authentication flows
├── components/            # Reusable UI components
├── lib/                   # Core utilities
└── utils/                # Helper functions
```

## Key Features

- 🔐 Secure authentication with Supabase
- 📊 Real-time dashboard with data synchronization
- 💳 Secure payment processing with Stripe
- 🌙 Theme switching with system preference detection
- 📱 Fully responsive design
- 🎨 Modern UI with accessibility features
- 🔄 Real-time updates and notifications
- 📝 Rich text editing with Markdown support
- 🎯 Form validation and error handling
- 🔒 Protected routes and role-based access

## Development Workflow

1. Feature Development
   - Create feature branch
   - Implement with TypeScript
   - Add tests
   - Submit PR

2. Code Review
   - Type checking
   - Linting
   - Performance review
   - Accessibility audit

3. Deployment
   - Automated builds
   - Environment-specific configs
   - Performance monitoring

