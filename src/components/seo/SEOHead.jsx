import React, { useEffect } from 'react';
import { useSEOContext } from '@/contexts/SEOContext';
import useSEO from '@/hooks/useSEO';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type,
  structuredData 
}) => {
  const { seoData, getStructuredData } = useSEOContext();
  
  const finalSeoData = {
    title: title || seoData.title,
    description: description || seoData.description,
    keywords: keywords || seoData.keywords,
    image: image || seoData.image,
    url: url || seoData.url,
    type: type || seoData.type,
    structuredData: structuredData || getStructuredData()
  };

  useSEO(finalSeoData);

  return null;
};

export default SEOHead;
