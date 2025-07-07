# 📁 SentraBASE Project Structure

## 🏗️ Directory Structure

```
SentraBASE/
├── 📁 public/                          # Static assets
│   ├── favicon.ico                     # Website favicon
│   ├── manifest.json                   # PWA manifest
│   └── android-chrome-192x192.png      # App icons
│
├── 📁 src/                             # Source code
│   ├── 📁 components/                  # React components
│   │   ├── 📁 admin/                   # Admin dashboard components
│   │   │   ├── AdminRoute.jsx          # Admin authentication & routing
│   │   │   ├── AdvancedAnalytics.jsx   # Business analytics dashboard
│   │   │   ├── AdvancedNotifications.jsx # WhatsApp & Email notifications
│   │   │   ├── CalendarManagement.jsx  # Calendar & scheduling
│   │   │   ├── CustomerManagement.jsx  # Customer CRM system
│   │   │   ├── TaskManagement.jsx      # Task coordination
│   │   │   ├── TeamManagement.jsx      # Team & staff management
│   │   │   ├── EnhancedWorkflowAutomation.jsx # Workflow builder
│   │   │   ├── OrderMonitoring.jsx     # Live order tracking
│   │   │   ├── AddCustomerModal.jsx    # Customer creation form
│   │   │   ├── NewTaskModal.jsx        # Task creation form
│   │   │   ├── AddMemberModal.jsx      # Team member form
│   │   │   ├── EventModal.jsx          # Calendar event form
│   │   │   ├── WorkflowBuilderModal.jsx # Workflow creation
│   │   │   ├── TeamMemberModal.jsx     # Team member details
│   │   │   ├── TestDataGenerator.jsx   # Development data generator
│   │   │   └── DebugPanel.jsx          # Development debug tools
│   │   │
│   │   ├── 📁 sentrabase/              # Landing page components
│   │   │   ├── 📁 layout/              # Layout components
│   │   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   │   └── Footer.jsx          # Website footer
│   │   │   │
│   │   │   └── 📁 sections/            # Landing page sections
│   │   │       ├── HeroSection.jsx     # Hero banner
│   │   │       ├── ProblemSection.jsx  # Problem statement
│   │   │       ├── SolutionSection.jsx # Solution overview
│   │   │       ├── CorePillarsSection.jsx # Core features
│   │   │       ├── PricingSection.jsx  # Pricing plans
│   │   │       ├── TrustSignalSection.jsx # Testimonials
│   │   │       └── FinalCTASection.jsx # Call to action
│   │   │
│   │   ├── 📁 ui/                      # Reusable UI components
│   │   │   ├── button.jsx              # Button component
│   │   │   ├── input.jsx               # Input component
│   │   │   └── toaster.jsx             # Toast notifications
│   │   │
│   │   ├── 📁 auth/                    # Authentication components
│   │   │   └── AuthProvider.jsx        # Auth context provider
│   │   │
│   │   ├── 📁 security/                # Security components
│   │   │   └── SecurityProvider.jsx    # Security context
│   │   │
│   │   ├── 📁 seo/                     # SEO components
│   │   │   ├── SEOHead.jsx             # SEO meta tags
│   │   │   └── MedicalSchema.jsx       # Medical schema markup
│   │   │
│   │   └── ErrorBoundary.jsx           # Error boundary component
│   │
│   ├── 📁 contexts/                    # React contexts
│   │   ├── SEOContext.jsx              # SEO context
│   │   └── PaymentContext.jsx          # Payment context
│   │
│   ├── 📁 services/                    # Service layers
│   │   ├── whatsappService.js          # WhatsApp integration
│   │   ├── emailService.js             # Email notifications
│   │   └── notificationManager.js      # Notification management
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   └── notificationHelper.js       # Notification helpers
│   │
│   ├── 📁 lib/                         # Library configurations
│   │   └── utils.js                    # Utility functions
│   │
│   ├── App.jsx                         # Main application component
│   ├── main.jsx                        # Application entry point
│   └── index.css                       # Global styles
│
├── 📄 package.json                     # Project dependencies
├── 📄 package-lock.json                # Dependency lock file
├── 📄 vite.config.js                   # Vite configuration
├── 📄 tailwind.config.js               # Tailwind CSS configuration
├── 📄 postcss.config.js                # PostCSS configuration
├── 📄 jsconfig.json                    # JavaScript configuration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 README.md                        # Project documentation
├── 📄 LICENSE                          # MIT license
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
└── 📄 STRUCTURE.md                     # This file
```

## 🧩 Component Architecture

### **Admin Dashboard Components**
- **AdminRoute.jsx** - Main admin router with authentication
- **AdvancedAnalytics.jsx** - Business intelligence dashboard
- **AdvancedNotifications.jsx** - Dual notification system (WhatsApp + Email)
- **CalendarManagement.jsx** - Event and appointment scheduling
- **CustomerManagement.jsx** - Complete CRM system
- **TaskManagement.jsx** - Team task coordination
- **TeamManagement.jsx** - Staff and workload management
- **EnhancedWorkflowAutomation.jsx** - Business process automation

### **Landing Page Components**
- **HeroSection.jsx** - Main banner with value proposition
- **ProblemSection.jsx** - Healthcare industry challenges
- **SolutionSection.jsx** - SentraBASE solution overview
- **CorePillarsSection.jsx** - Key features and benefits
- **PricingSection.jsx** - Subscription plans
- **TrustSignalSection.jsx** - Customer testimonials
- **FinalCTASection.jsx** - Call to action

### **Modal Components**
- **AddCustomerModal.jsx** - Customer creation with 20+ fields
- **NewTaskModal.jsx** - Task creation with team assignment
- **AddMemberModal.jsx** - Team member onboarding
- **EventModal.jsx** - Calendar event scheduling
- **WorkflowBuilderModal.jsx** - Workflow automation builder

## 🔧 Service Architecture

### **Notification Services**
- **whatsappService.js** - WhatsApp integration with rate limiting
- **emailService.js** - Email notifications with mailto URLs
- **notificationManager.js** - Centralized notification management
- **notificationHelper.js** - Utility functions for notifications

### **Context Providers**
- **AuthProvider.jsx** - Authentication state management
- **SecurityProvider.jsx** - Security context and protection
- **SEOProvider.jsx** - SEO optimization context
- **PaymentProvider.jsx** - Payment processing context

## 📊 Data Flow

### **Admin Dashboard Flow**
1. **Authentication** - AdminRoute validates access
2. **Tab Navigation** - User selects management module
3. **Data Loading** - Components load from localStorage
4. **User Actions** - CRUD operations on data
5. **Notifications** - Automatic WhatsApp + Email alerts
6. **Data Persistence** - Save to localStorage

### **Notification Flow**
1. **Event Trigger** - User action (create task, add customer)
2. **Notification Helper** - Format notification data
3. **Service Layer** - WhatsApp + Email services
4. **Rate Limiting** - Prevent spam notifications
5. **Delivery** - Open WhatsApp + Email clients
6. **History Tracking** - Store notification history

## 🎨 Styling Architecture

### **Tailwind CSS Classes**
- **Layout** - Flexbox and Grid utilities
- **Colors** - Slate color palette for dark theme
- **Typography** - Responsive text sizing
- **Spacing** - Consistent margin and padding
- **Components** - Reusable component styles

### **Theme System**
- **Dark Theme** - Professional healthcare interface
- **Color Palette** - Slate, blue, green, red accents
- **Typography** - Inter font family
- **Responsive** - Mobile-first breakpoints

## 🔒 Security Architecture

### **Authentication**
- **Password Protection** - Admin dashboard access
- **Session Management** - Timeout and validation
- **Route Protection** - Secure admin routes

### **Data Security**
- **Input Validation** - Form validation and sanitization
- **XSS Protection** - Safe HTML rendering
- **Local Storage** - Encrypted data storage

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** - 320px - 768px
- **Tablet** - 768px - 1024px
- **Desktop** - 1024px+

### **Components**
- **Grid Layouts** - Responsive grid systems
- **Navigation** - Mobile-friendly menus
- **Forms** - Touch-optimized inputs
- **Tables** - Horizontal scrolling on mobile

## 🚀 Performance Optimization

### **Code Splitting**
- **Lazy Loading** - Dynamic imports for large components
- **Bundle Optimization** - Minimized production builds
- **Tree Shaking** - Remove unused code

### **Caching Strategy**
- **Local Storage** - Client-side data persistence
- **Component Memoization** - React.memo optimization
- **Asset Caching** - Static asset optimization

This structure provides a scalable, maintainable architecture for the SentraBASE hospital management system.
