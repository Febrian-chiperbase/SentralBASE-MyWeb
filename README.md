# SentraBASE - Hospital Management System

Hospital Management System untuk penyedia layanan kesehatan di Indonesia.

## Overview

SentraBASE adalah sistem manajemen rumah sakit yang dirancang untuk penyedia layanan kesehatan di Indonesia. Sistem ini menyediakan solusi lengkap untuk mengelola operasi rumah sakit, mulai dari registrasi pasien hingga tugas administratif.

## Fitur Utama

- Manajemen Rumah Sakit - Manajemen pasien dan rekam medis
- Manajemen Customer - CRM untuk penyedia layanan kesehatan  
- Manajemen Tugas - Koordinasi tim dan manajemen workflow
- Manajemen Kalender - Penjadwalan appointment dan event
- Manajemen Tim - Koordinasi staff dan manajemen beban kerja
- Otomasi Workflow - Proses bisnis otomatis
- Analytics - Business intelligence dan reporting
- Integrasi WhatsApp - Notifikasi real-time via WhatsApp
- Notifikasi Email - Alert email profesional
- Admin Dashboard - Interface administratif yang aman

## Demo

- Website: http://localhost:5173/
- Admin Dashboard: http://localhost:5173/#admin
- Login: `sentrabase2025`

## Teknologi

### Frontend
- React 18
- Vite  
- Tailwind CSS
- Framer Motion
- Lucide React

### Fitur
- Responsive Design
- Dark Theme
- Real-time Updates
- Local Storage
- SEO Optimized

## Instalasi

### Prerequisites
- Node.js 16.0 atau lebih tinggi
- npm atau yarn

### Setup
```bash
git clone https://github.com/YOUR_USERNAME/SentraBASE.git
cd SentraBASE
npm install
npm run dev
npm run build
```

### Environment Setup
```bash
cp .env.example .env
nano .env
```

## Penggunaan

### Landing Page
- Kunjungi `http://localhost:5173/`
- Jelajahi fitur manajemen rumah sakit

### Admin Dashboard  
- Akses `http://localhost:5173/#admin`
- Login dengan password: `sentrabase2025`

## Konfigurasi

### Notifikasi
```javascript
const whatsappConfig = {
  adminPhone: '+6282132115008',
  enabled: true,
  rateLimitDelay: 2000
};

const emailConfig = {
  adminEmail: 'fery10febrian@gmail.com',
  enabled: true,
  rateLimitDelay: 3000
};
```

## Author

**Febrian Fery**
- Email: fery10febrian@gmail.com
- WhatsApp: +6282132115008

## License

MIT License
