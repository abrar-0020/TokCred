import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireIssuer from './components/RequireIssuer';

import ConnectionDebug from './components/ConnectionDebug';
import Home from './pages/Home';
import IssueCredential from './pages/IssueCredential';
import Dashboard from './pages/Dashboard';
import VerifyCredential from './pages/VerifyCredential';
import PublicVerify from './pages/PublicVerify';
import VerifyUpload from './pages/VerifyUpload';
import History from './pages/History';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Features from './pages/Features';
import Developers from './pages/Developers';
import StudentDashboard from './pages/StudentDashboard';
import ForInstitutions from './pages/ForInstitutions';

const obsidianRoutes = ['/', '/dashboard', '/student-dashboard', '/issue', '/verify', '/public-verify', '/history', '/privacy', '/terms', '/features', '/institutions', '/for-institutions'];

const AppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.endsWith('/') && location.pathname !== '/' ? location.pathname.slice(0, -1) : location.pathname;
  const isCustomNavRoute = ['/', '/dashboard', '/student-dashboard', '/issue', '/features', '/public-verify', '/verify/upload', '/developers', '/history', '/privacy', '/terms', '/institutions', '/for-institutions'].includes(currentPath);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {!isCustomNavRoute && <Navbar />}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/issue"
            element={
              <RequireIssuer>
                <IssueCredential />
              </RequireIssuer>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireIssuer>
                <Dashboard />
              </RequireIssuer>
            }
          />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/verify" element={<VerifyCredential />} />
          <Route path="/public-verify" element={<PublicVerify />} />
          <Route path="/verify/upload" element={<VerifyUpload />} />
          <Route
            path="/history"
            element={
              <RequireIssuer>
                <History />
              </RequireIssuer>
            }
          />
          <Route path="/institutions" element={<ForInstitutions />} />
          <Route path="/for-institutions" element={<ForInstitutions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/features" element={<Features />} />
          <Route path="/developers" element={<Developers />} />
        </Routes>
      </main>
      <Footer />

      <ConnectionDebug />
    </div>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <Web3Provider>
        <Router>
          <AppLayout />
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
