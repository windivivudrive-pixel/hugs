import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { MainSite } from './components/MainSite';
import { ServicePage } from './components/ServicePage';
import { ProjectsPage } from './components/ProjectsPage';
import { ArticlePage } from './components/ArticlePage';
import { AdminPage } from './components/AdminPage';
import { AboutPage } from './components/AboutPage';
import { CareersPage } from './components/CareersPage';
import { NewsPage } from './components/NewsPage';

import { AllProjectPage } from './components/AllProjectPage';

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
                <MainSite isLoading={isLoading} />
                {/* Loading Screen - renders ON TOP */}
                {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
              </>
            }
          />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/allprojects" element={<AllProjectPage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

