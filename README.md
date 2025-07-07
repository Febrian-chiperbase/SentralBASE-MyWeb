# 🏥 SentraBASE - Sistem RME & Keamanan Klinik

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.14-green.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Platform Rekam Medis Elektronik (RME) dengan keamanan tingkat tinggi untuk klinik dan rumah sakit di Indonesia. Dilengkapi dengan sistem pembayaran terintegrasi yang mendukung transfer langsung ke rekening BCA.

## ✨ Features

### 🏥 Healthcare Management
- **Rekam Medis Elektronik (RME)** - Digital patient records
- **Manajemen Pasien** - Patient registration & management
- **Jadwal Dokter** - Doctor scheduling system
- **Resep Digital** - Electronic prescription
- **Billing & Invoicing** - Automated billing system
- **Laporan Analitik** - Healthcare analytics & reports

### 💳 Payment System
- **Multiple Payment Gateways** - DOKU, Xendit, Midtrans
- **BCA Integration** - Direct settlement to BCA account
- **Manual Transfer** - 100% free bank transfer option
- **Real-time Verification** - Instant payment confirmation
- **Fee Optimization** - Lowest fees in Indonesian market

### 🔒 Security & Compliance
- **Healthcare Data Security** - HIPAA-ready infrastructure
- **Indonesian Compliance** - Kemenkes standards
- **Data Encryption** - End-to-end encryption
- **Audit Trail** - Complete transaction logging
- **Backup & Recovery** - Automated data backup

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Professional healthcare interface
- **Accessibility** - WCAG 2.1 compliant
- **Progressive Web App** - Offline capability
- **Real-time Updates** - Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/SentraBASE.git
cd SentraBASE

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Setup

Create `.env` file with your configuration:

```env
# BCA Payment Configuration
VITE_BCA_ACCOUNT_NUMBER=your_bca_account_number

# Midtrans Configuration (Optional)
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
VITE_MIDTRANS_SERVER_KEY=your_midtrans_server_key
VITE_MIDTRANS_SANDBOX=true

# DOKU Configuration (Optional - Lowest Fees)
VITE_DOKU_CLIENT_ID=your_doku_client_id
VITE_DOKU_SHARED_KEY=your_doku_shared_key

# Site Configuration
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=SentraBASE
```

## 💰 Payment Options & Fees

| Payment Method | Fee | Processing Time | Recommended |
|----------------|-----|-----------------|-------------|
| **Manual Transfer** | **FREE** | 1-2 hours | ⭐ **Best for startups** |
| **DOKU Gateway** | Rp 2.500 (VA) | Instant | ⭐ **Lowest fees** |
| **Xendit** | Rp 3.000 (VA) | Instant | Good alternative |
| **Midtrans** | Rp 4.000 (VA) | Instant | Most popular |

### 🆓 Free Manual Transfer
- **Zero fees** - 100% profit margin
- **Direct to BCA** - Money goes straight to your account
- **Perfect for MVP** - Start without payment gateway costs
- **WhatsApp verification** - Manual but reliable

### 💳 Automated Gateways
- **DOKU** - Lowest fees in Indonesia (Rp 2.500 vs Midtrans Rp 4.000)
- **Auto settlement** - Money automatically transferred to BCA
- **Real-time confirmation** - Instant payment verification
- **Multiple methods** - VA, Credit Card, E-wallet

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon library

### Payment Integration
- **Multi-provider** - DOKU, Xendit, Midtrans support
- **Fallback system** - Never-fail payment processing
- **Smart routing** - Automatic fee optimization
- **Real-time status** - Live payment tracking

### SEO & Performance
- **Medical Schema** - Healthcare-specific structured data
- **Meta optimization** - Perfect for healthcare keywords
- **Core Web Vitals** - Optimized performance scores
- **Mobile-first** - Responsive design

## 📊 Pricing Plans

### 💡 Starter - Rp 1.5jt/month
- 500 patients, 3 users, 10GB storage
- Basic RME features
- Email support
- Perfect for small clinics

### 🚀 Professional - Rp 3jt/month (Most Popular)
- 5,000 patients, unlimited users, 100GB
- Full RME + telemedicine
- Priority support
- Multi-branch support

### 🏢 Enterprise - Custom Pricing
- Unlimited everything
- Custom integrations
- Dedicated support
- SLA guarantees

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests
npm run test:coverage # Test coverage report

# Deployment
npm run deploy       # Deploy to production
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── seo/            # SEO components
│   ├── payment/        # Payment components
│   └── sentrabase/     # App-specific components
├── contexts/           # React contexts
├── services/           # API services
├── utils/              # Utility functions
├── styles/             # Global styles
└── assets/             # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Traditional Hosting
```bash
# Build
npm run build

# Upload dist/ folder to your server
```

## 📈 Business Benefits

### 💰 Revenue Optimization
- **Multiple pricing tiers** - Capture different market segments
- **Payment flexibility** - Free and paid options
- **Lowest fees** - DOKU integration saves 37.5% vs Midtrans
- **Zero lost sales** - Fallback system ensures payment success

### 🎯 Market Positioning
- **Healthcare-focused** - Specialized for Indonesian medical market
- **Compliance-ready** - Meets Kemenkes requirements
- **Professional design** - Builds trust with medical professionals
- **Mobile-optimized** - Perfect for busy healthcare environments

### 📊 Analytics & Insights
- **Payment tracking** - Monitor revenue and conversion
- **User behavior** - Understand customer journey
- **Performance metrics** - Core Web Vitals monitoring
- **SEO analytics** - Track organic growth

## 🔒 Security

### Data Protection
- **HTTPS everywhere** - SSL/TLS encryption
- **Input validation** - XSS and injection protection
- **Secure headers** - OWASP security headers
- **Environment isolation** - Separate dev/prod configs

### Payment Security
- **PCI DSS ready** - Credit card security standards
- **No sensitive data storage** - Tokenization approach
- **Webhook verification** - Signature validation
- **Audit logging** - Complete transaction trails

## 📞 Support

### Documentation
- [Payment Setup Guide](./BCA_PAYMENT_SETUP_GUIDE.md)
- [SEO Optimization Guide](./SEO_UPGRADE_GUIDE.md)
- [Error Troubleshooting](./ERROR_FIX_GUIDE.md)
- [Fee Comparison](./PAYMENT_FEE_COMPARISON.md)

### Contact
- **Email**: support@sentrabase.com
- **WhatsApp**: +62-812-3456-7890
- **Website**: https://sentrabase.com

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first approach
- **Indonesian Payment Gateways** - DOKU, Xendit, Midtrans
- **Healthcare Community** - For feedback and requirements

---

**Built with ❤️ for Indonesian Healthcare**

*Digitizing healthcare, one clinic at a time* 🏥✨
