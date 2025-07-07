import React, { createContext, useContext, useState } from 'react';

const SEOContext = createContext();

export const useSEOContext = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEOContext must be used within SEOProvider');
  }
  return context;
};

export const SEOProvider = ({ children }) => {
  const [seoData, setSeoData] = useState({
    title: 'SentraBASE - Sistem RME & Keamanan Data Klinik Terpercaya',
    description: 'Platform Rekam Medis Elektronik (RME) dengan keamanan tingkat tinggi untuk klinik dan rumah sakit. Kelola data pasien dengan aman, efisien, dan sesuai standar kesehatan Indonesia.',
    keywords: 'RME, rekam medis elektronik, sistem informasi klinik, keamanan data medis, SIMRS, electronic medical record, klinik digital, rumah sakit digital, Indonesia',
    image: 'https://sentrabase.com/og-image-medical.jpg',
    url: 'https://sentrabase.com/',
    type: 'website'
  });

  const updateSEO = (newSeoData) => {
    setSeoData(prev => ({ ...prev, ...newSeoData }));
  };

  const getStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SentraBASE",
      "description": seoData.description,
      "url": seoData.url,
      "logo": {
        "@type": "ImageObject",
        "url": "https://sentrabase.com/logo-medical.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-21-1234-5678",
        "contactType": "customer service",
        "availableLanguage": ["Indonesian", "English"],
        "serviceType": "Medical Records Management"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jl. Sudirman No. 123",
        "addressLocality": "Jakarta",
        "addressRegion": "DKI Jakarta",
        "postalCode": "10220",
        "addressCountry": "ID"
      },
      "sameAs": [
        "https://www.linkedin.com/company/sentrabase",
        "https://twitter.com/sentrabase",
        "https://www.facebook.com/sentrabase"
      ],
      "offers": {
        "@type": "Offer",
        "description": "Sistem Rekam Medis Elektronik untuk Klinik dan Rumah Sakit",
        "category": "Healthcare Technology Services"
      },
      "industry": "Healthcare Technology",
      "knowsAbout": [
        "Electronic Medical Records",
        "Healthcare Data Security",
        "Medical Information Systems",
        "HIPAA Compliance",
        "Healthcare IT Solutions"
      ],
      "serviceArea": {
        "@type": "Country",
        "name": "Indonesia"
      }
    };
  };

  const value = {
    seoData,
    updateSEO,
    getStructuredData
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};

export default SEOProvider;
