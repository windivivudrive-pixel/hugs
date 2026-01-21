import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { MainSite } from './components/MainSite';
import { ServicePage } from './components/ServicePage';
import { ArticlePage } from './components/ArticlePage';
import { AdminPage } from './components/AdminPage';
import { AboutPage } from './components/AboutPage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white relative">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* MainSite - ALWAYS rendered underneath */}
                <MainSite />
                {/* Loading Screen - renders ON TOP */}
                {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
              </>
            }
          />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
