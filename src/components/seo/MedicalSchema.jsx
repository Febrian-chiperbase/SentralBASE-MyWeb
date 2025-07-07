import React, { useEffect } from 'react';

const MedicalSchema = ({ 
  organizationType = "MedicalOrganization",
  services = [],
  specialties = [],
  location = null 
}) => {
  useEffect(() => {
    const medicalSchema = {
      "@context": "https://schema.org",
      "@type": organizationType,
      "name": "SentraBASE",
      "description": "Penyedia sistem Rekam Medis Elektronik (RME) dan solusi keamanan data untuk klinik dan rumah sakit di Indonesia",
      "url": "https://sentrabase.com",
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
      "serviceArea": {
        "@type": "Country",
        "name": "Indonesia"
      },
      "medicalSpecialty": specialties.length > 0 ? specialties : [
        "Health Information Technology",
        "Medical Records Management",
        "Healthcare Data Security"
      ],
      "serviceType": services.length > 0 ? services : [
        "Electronic Medical Records (RME)",
        "Healthcare Data Management",
        "Medical Information Systems",
        "Healthcare IT Solutions",
        "Patient Data Security",
        "Clinical Documentation",
        "Healthcare Compliance Solutions"
      ],
      "knowsAbout": [
        "Rekam Medis Elektronik",
        "Sistem Informasi Kesehatan",
        "Keamanan Data Medis",
        "HIPAA Compliance",
        "Healthcare IT",
        "Patient Privacy",
        "Medical Data Analytics",
        "Telemedicine Support"
      ],
      "offers": [
        {
          "@type": "Service",
          "name": "Sistem RME Lengkap",
          "description": "Platform rekam medis elektronik dengan fitur lengkap untuk klinik dan rumah sakit",
          "serviceType": "Electronic Medical Records"
        },
        {
          "@type": "Service", 
          "name": "Keamanan Data Medis",
          "description": "Solusi keamanan berlapis untuk melindungi data pasien dan informasi medis",
          "serviceType": "Healthcare Data Security"
        },
        {
          "@type": "Service",
          "name": "Integrasi Sistem Kesehatan",
          "description": "Integrasi dengan sistem laboratorium, farmasi, dan peralatan medis",
          "serviceType": "Healthcare System Integration"
        },
        {
          "@type": "Service",
          "name": "Pelatihan dan Support",
          "description": "Pelatihan staff medis dan dukungan teknis 24/7",
          "serviceType": "Healthcare Training and Support"
        }
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Healthcare IT Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Kementerian Kesehatan RI"
          }
        }
      ]
    };

    // Add location-specific data if provided
    if (location) {
      medicalSchema.location = {
        "@type": "Place",
        "address": medicalSchema.address,
        "geo": location.geo || null
      };
    }

    // Inject structured data
    let script = document.querySelector('#medical-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'medical-structured-data';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(medicalSchema);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('#medical-structured-data');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [organizationType, services, specialties, location]);

  return null;
};

export default MedicalSchema;
