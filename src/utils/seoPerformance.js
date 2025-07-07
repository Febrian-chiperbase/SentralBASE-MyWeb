// SEO Performance Monitoring Utilities

export const measurePageSpeed = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      // Core Web Vitals
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      
      // Additional metrics
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnection: navigation.connectEnd - navigation.connectStart,
      serverResponse: navigation.responseEnd - navigation.requestStart,
      domProcessing: navigation.domComplete - navigation.domLoading,
      
      // Total page load time
      totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
    };
    
    return metrics;
  }
  return null;
};

export const checkSEOElements = () => {
  const seoChecklist = {
    title: {
      exists: !!document.title,
      length: document.title.length,
      optimal: document.title.length >= 30 && document.title.length <= 60
    },
    description: {
      exists: !!document.querySelector('meta[name="description"]'),
      length: document.querySelector('meta[name="description"]')?.content?.length || 0,
      optimal: false
    },
    h1: {
      exists: !!document.querySelector('h1'),
      count: document.querySelectorAll('h1').length,
      optimal: document.querySelectorAll('h1').length === 1
    },
    images: {
      total: document.querySelectorAll('img').length,
      withAlt: document.querySelectorAll('img[alt]').length,
      withoutAlt: document.querySelectorAll('img:not([alt])').length
    },
    links: {
      internal: document.querySelectorAll('a[href^="/"], a[href^="#"]').length,
      external: document.querySelectorAll('a[href^="http"]:not([href*="sentrabase.com"])').length,
      nofollow: document.querySelectorAll('a[rel*="nofollow"]').length
    },
    structured: {
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      microdata: document.querySelectorAll('[itemscope]').length
    }
  };
  
  // Check description length
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const descLength = description.content.length;
    seoChecklist.description.optimal = descLength >= 120 && descLength <= 160;
  }
  
  return seoChecklist;
};

export const generateSEOReport = () => {
  const performance = measurePageSpeed();
  const seoElements = checkSEOElements();
  
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    performance,
    seo: seoElements,
    score: calculateSEOScore(seoElements)
  };
  
  return report;
};

const calculateSEOScore = (elements) => {
  let score = 0;
  let maxScore = 0;
  
  // Title scoring
  maxScore += 20;
  if (elements.title.exists) score += 10;
  if (elements.title.optimal) score += 10;
  
  // Description scoring
  maxScore += 20;
  if (elements.description.exists) score += 10;
  if (elements.description.optimal) score += 10;
  
  // H1 scoring
  maxScore += 15;
  if (elements.h1.exists) score += 10;
  if (elements.h1.optimal) score += 5;
  
  // Images scoring
  maxScore += 15;
  if (elements.images.total > 0) {
    const altRatio = elements.images.withAlt / elements.images.total;
    score += Math.round(altRatio * 15);
  }
  
  // Links scoring
  maxScore += 15;
  if (elements.links.internal > 0) score += 8;
  if (elements.links.external > 0) score += 7;
  
  // Structured data scoring
  maxScore += 15;
  if (elements.structured.jsonLd > 0) score += 15;
  
  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100)
  };
};

// Auto-run SEO check in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const report = generateSEOReport();
      console.group('🔍 SEO Performance Report');
      console.log('Overall Score:', `${report.score.percentage}%`);
      console.log('Performance Metrics:', report.performance);
      console.log('SEO Elements:', report.seo);
      console.groupEnd();
    }, 2000);
  });
}
