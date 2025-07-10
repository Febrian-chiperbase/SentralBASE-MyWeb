# 🏥 SentraBASE - Hospital Management System

**Complete Hospital Management System for Indonesian Healthcare Providers**

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 **Overview**

SentraBASE is a comprehensive hospital management system designed specifically for Indonesian healthcare providers. It offers a complete solution for managing hospital operations, from patient registration to administrative tasks, with integrated WhatsApp and email notifications.

### 🎯 **Key Features**

- **🏥 Hospital Management** - Complete patient and medical record management
- **👥 Customer Management** - Advanced CRM for healthcare providers
- **📋 Task Management** - Team coordination and workflow management
- **📅 Calendar Management** - Appointment scheduling and event management
- **👨‍💼 Team Management** - Staff coordination and workload management
- **⚡ Workflow Automation** - Automated business processes
- **📊 Advanced Analytics** - Business intelligence and reporting
- **📱 WhatsApp Integration** - Real-time notifications via WhatsApp
- **📧 Email Notifications** - Professional email alerts
- **🔒 Admin Dashboard** - Secure administrative interface

## 🚀 **Live Demo**

- **Website:** [SentraBASE Landing Page](http://localhost:5173/)
- **Admin Dashboard:** [Admin Panel](http://localhost:5173/#admin)
- **Login:** `sentrabase2025`

## 📱 **Notification Integration**

### **WhatsApp Notifications**
- **Phone:** +6282132115008
- **Features:** Real-time alerts with emoji and markdown formatting
- **Triggers:** Tasks, customers, calendar events, team updates

### **Email Notifications**
- **Email:** fery10febrian@gmail.com
- **Features:** Detailed professional notifications
- **Format:** Structured plain text with complete information

## 🛠 **Technology Stack**

### **Frontend**
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### **Features**
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Professional dark interface
- **Real-time Updates** - Live data synchronization
- **Local Storage** - Client-side data persistence
- **SEO Optimized** - Search engine friendly

## 📦 **Installation**

### **Prerequisites**
- Node.js 16.0 or higher
- npm or yarn package manager

### **Setup**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SentraBASE.git

# Navigate to project directory
cd SentraBASE

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

## 🎯 **Usage**

### **1. Landing Page**
- Visit `http://localhost:5173/`
- Explore hospital management features
- View pricing plans and testimonials

### **2. Admin Dashboard**
- Access `http://localhost:5173/#admin`
- Login with password: `sentrabase2025`
- Manage all hospital operations

### **3. Core Modules**

#### **📊 Live Monitoring**
- Real-time customer tracking
- Activity monitoring
- Performance metrics

#### **📈 Advanced Analytics**
- Business intelligence dashboard
- Revenue forecasting
- Performance analytics

#### **⚡ Workflow Automation**
- Automated business processes
- Custom workflow builder
- Trigger-based actions

#### **📋 Task Management**
- Team task coordination
- Priority management
- Deadline tracking

#### **📅 Calendar Management**
- Appointment scheduling
- Event management
- Meeting coordination

#### **👨‍💼 Team Management**
- Staff coordination
- Workload management
- Role-based access

#### **👥 Customer Management**
- Patient records
- Customer relationship management
- Communication tracking

#### **📱 Notifications**
- WhatsApp integration
- Email notifications
- Real-time alerts

## 🔧 **Configuration**

### **Notification Settings**
```javascript
// WhatsApp Configuration
const whatsappConfig = {
  adminPhone: '+6282132115008',
  enabled: true,
  rateLimitDelay: 2000
};

// Email Configuration
const emailConfig = {
  adminEmail: 'fery10febrian@gmail.com',
  enabled: true,
  rateLimitDelay: 3000
};
```

### **Admin Access**
```javascript
// Admin Authentication
const adminConfig = {
  password: 'sentrabase2025',
  sessionTimeout: 3600000 // 1 hour
};
```

## 📊 **Features Overview**

### **🏥 Hospital Management**
- Patient registration and records
- Medical history tracking
- Appointment scheduling
- Billing and invoicing

### **👥 Customer Relationship Management**
- Customer database with 20+ fields
- Industry categorization (9 industries)
- Customer type management (4 types)
- Source tracking (8 sources)
- CSV export functionality

### **📋 Task Management**
- Task creation with 6 task types
- Priority system (4 levels)
- Team assignment with workload tracking
- Due date management
- Progress tracking

### **📅 Calendar System**
- Event scheduling
- Meeting management
- Reminder system
- Attendee management

### **👨‍💼 Team Coordination**
- Team member management
- Role assignment
- Workload monitoring
- Performance tracking

### **⚡ Automation**
- Workflow builder
- Trigger-based actions
- Automated notifications
- Process optimization

### **📊 Analytics**
- Revenue analytics
- Customer analytics
- Team performance
- Predictive forecasting

### **📱 Dual Notifications**
- WhatsApp instant messaging
- Professional email alerts
- Dual-channel delivery
- Rate limiting protection

## 🎨 **UI/UX Features**

### **Design System**
- **Dark Theme** - Professional healthcare interface
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant
- **Animation** - Smooth transitions with Framer Motion

### **Components**
- **Modular Architecture** - Reusable components
- **Form Validation** - Comprehensive input validation
- **Data Tables** - Advanced data display
- **Charts & Graphs** - Visual analytics

## 🔒 **Security**

### **Authentication**
- Password-protected admin access
- Session management
- Secure routing

### **Data Protection**
- Local storage encryption
- Input sanitization
- XSS protection

## 📈 **Performance**

### **Optimization**
- **Code Splitting** - Lazy loading components
- **Bundle Optimization** - Minimized production builds
- **Caching** - Efficient data caching
- **SEO** - Search engine optimization

### **Metrics**
- **Lighthouse Score** - 90+ performance
- **Bundle Size** - Optimized for fast loading
- **Runtime Performance** - Smooth user experience

## 🧪 **Testing**

### **Test Coverage**
- Unit tests for core functions
- Integration tests for workflows
- E2E tests for user journeys

### **Quality Assurance**
- Code linting with ESLint
- Type checking with PropTypes
- Performance monitoring

## 📚 **Documentation**

### **API Documentation**
- Component API reference
- Service documentation
- Configuration guide

### **User Guides**
- Admin dashboard guide
- Feature tutorials
- Best practices

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add documentation for new features

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Febrian Fery**
- Email: fery10febrian@gmail.com
- WhatsApp: +6282132115008
- GitHub: Febrian-chiperbase(https://github.com/Febrian-chiperbase)

## 🙏 **Acknowledgments**

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the fast build tool
- All contributors and testers

## 📞 **Support**

For support and questions:
- **Email:** fery10febrian@gmail.com
- **WhatsApp:** +6282132115008
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/SentraBASE/issues)

## 🗺 **Roadmap**

### **Version 2.0 (Planned)**
- [ ] Multi-language support (Indonesian/English)
- [ ] Advanced reporting system
- [ ] Mobile app companion
- [ ] API integration
- [ ] Cloud deployment options

### **Version 1.5 (In Progress)**
- [x] WhatsApp integration
- [x] Email notifications
- [x] Advanced analytics
- [x] Workflow automation
- [ ] User role management
- [ ] Data export/import

### **Version 1.0 (Current)**
- [x] Core hospital management
- [x] Admin dashboard
- [x] Task management
- [x] Customer management
- [x] Calendar system
- [x] Team management
- [x] Notification system

---

**Made with ❤️ for Indonesian Healthcare Providers**

*SentraBASE - Revolutionizing Hospital Management in Indonesia*
