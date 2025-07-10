import React, { createContext, useContext } from 'react';

const PackageInfoContext = createContext();

export const PackageInfoProvider = ({ children }) => {
  // Package definitions dengan detail lengkap
  const packageDefinitions = {
    starter: {
      id: 'starter',
      name: 'Starter',
      displayName: 'SentraBASE Starter',
      description: 'Paket dasar untuk klinik kecil',
      price: 15000000, // Updated to match main page yearly price
      billingCycle: 'yearly',
      maxUsers: 3,
      maxPatients: 500,
      features: [
        'Rekam Medis Elektronik (RME)',
        'Manajemen Pasien',
        'Jadwal Dokter',
        'Billing Sederhana',
        'Laporan Dasar',
        'Support Email',
        'Backup Harian',
        'SSL Certificate',
        'Mobile App Access'
      ],
      limitations: [
        'Maksimal 5 pengguna',
        'Maksimal 1.000 pasien',
        'Storage 10GB',
        'Support via email saja',
        'Tidak ada integrasi BPJS'
      ],
      setupTime: '3-5 hari kerja',
      trainingHours: 4,
      color: 'blue',
      icon: '🚀',
      popular: false
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      displayName: 'SentraBASE Professional',
      description: 'Paket lengkap untuk klinik menengah',
      price: 30000000, // Updated to match main page yearly price
      billingCycle: 'yearly',
      maxUsers: 'Unlimited',
      maxPatients: 5000,
      features: [
        'Semua fitur Starter',
        'Integrasi BPJS',
        'Farmasi & Inventory',
        'Laboratorium',
        'Radiologi',
        'Telemedicine',
        'Advanced Reporting',
        'WhatsApp Integration',
        'Support Phone & Chat',
        'Backup Real-time',
        'Multi-branch Support',
        'Custom Templates'
      ],
      limitations: [
        'Maksimal 15 pengguna',
        'Maksimal 5.000 pasien',
        'Storage 50GB'
      ],
      setupTime: '5-7 hari kerja',
      trainingHours: 8,
      color: 'green',
      icon: '⭐',
      popular: true
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      displayName: 'SentraBASE Enterprise',
      description: 'Solusi kustomisasi untuk klinik besar',
      price: 50000000, // Custom pricing for enterprise
      billingCycle: 'yearly',
      maxUsers: 'Unlimited',
      maxPatients: 'Unlimited',
      features: [
        'Semua fitur Professional',
        'Hospital Information System (HIS)',
        'Picture Archiving (PACS)',
        'Laboratory Information System (LIS)',
        'Pharmacy Information System',
        'Financial Management',
        'HR Management',
        'Supply Chain Management',
        'Business Intelligence',
        'API Integration',
        'Custom Development',
        'Dedicated Support',
        'On-premise Option',
        'White Label Solution'
      ],
      limitations: [
        'Tidak ada batasan'
      ],
      setupTime: '2-4 minggu',
      trainingHours: 24,
      color: 'purple',
      icon: '👑',
      popular: false
    }
  };

  // Get package info by ID
  const getPackageInfo = (packageId) => {
    return packageDefinitions[packageId?.toLowerCase()] || null;
  };

  // Get all packages
  const getAllPackages = () => {
    return Object.values(packageDefinitions);
  };

  // Compare packages
  const comparePackages = (currentPackageId) => {
    const current = getPackageInfo(currentPackageId);
    const all = getAllPackages();
    
    return {
      current,
      upgrades: all.filter(pkg => pkg.price > (current?.price || 0)),
      downgrades: all.filter(pkg => pkg.price < (current?.price || 0))
    };
  };

  // Calculate savings or additional cost
  const calculatePriceDifference = (fromPackageId, toPackageId) => {
    const fromPackage = getPackageInfo(fromPackageId);
    const toPackage = getPackageInfo(toPackageId);
    
    if (!fromPackage || !toPackage) return 0;
    
    return toPackage.price - fromPackage.price;
  };

  const value = {
    packageDefinitions,
    getPackageInfo,
    getAllPackages,
    comparePackages,
    calculatePriceDifference
  };

  return (
    <PackageInfoContext.Provider value={value}>
      {children}
    </PackageInfoContext.Provider>
  );
};

export const usePackageInfo = () => {
  const context = useContext(PackageInfoContext);
  if (!context) {
    throw new Error('usePackageInfo must be used within PackageInfoProvider');
  }
  return context;
};
