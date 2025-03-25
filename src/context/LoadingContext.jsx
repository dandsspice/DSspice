import { createContext, useContext, useState } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  
  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      <LoadingScreen show={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === null) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 