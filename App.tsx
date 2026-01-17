import React, { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { MainSite } from './components/MainSite';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* MainSite - ALWAYS rendered underneath */}
      <MainSite />

      {/* Loading Screen - renders ON TOP */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </div>
  );
};

export default App;
