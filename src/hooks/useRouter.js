import { useState, useEffect } from 'react';

export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen to browser navigation
    window.addEventListener('popstate', handleLocationChange);
    
    // Override history methods to trigger updates
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const navigate = (path) => {
    console.log(`🧭 Navigating to: ${path}`);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    
    // Trigger popstate event for other listeners
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const replace = (path) => {
    console.log(`🔄 Replacing with: ${path}`);
    window.history.replaceState({}, '', path);
    setCurrentPath(path);
    
    // Trigger popstate event for other listeners
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return {
    currentPath,
    navigate,
    replace,
    isPath: (path) => currentPath === path,
    isPathMatch: (paths) => paths.includes(currentPath)
  };
};
