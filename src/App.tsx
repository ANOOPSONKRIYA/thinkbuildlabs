import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Shared Components
import { Navigation, Footer, LightBeams, NoiseOverlay, ScrollToTop } from '@/components/shared';

// Public Pages
import { Home, Portfolio, ProjectDetail, Team, TeamMemberDetail, About } from '@/features/public/pages';

// Admin Pages
import { 
  Dashboard, 
  ProjectsPage, 
  TeamPage, 
  LogsPage, 
  SettingsPage,
  PortfolioForm, 
  TeamForm, 
  PortfolioEditLegacy, 
  TeamEditLegacy,
  AboutAdminPage,
} from '@/features/admin/pages';
import { AdminGate } from '@/features/admin/components/AdminGate';

// Member Pages
import { MemberDashboard, MemberProjectsPage, MemberProjectForm, MemberProfileForm } from '@/features/member/pages';
import { MemberGate } from '@/features/member/components/MemberGate';

import './App.css';

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Layout with navigation and footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-void">
      {/* Background Effects */}
      <LightBeams />
      <NoiseOverlay />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Initialize AOS
function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
    });
  }, []);
  
  return null;
}

// Toast initializer for theme
function ToastInitializer() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
        },
      }}
    />
  );
}

function App() {
  const AdminRoute = ({ children }: { children: React.ReactNode }) => (
    <AdminGate>{children}</AdminGate>
  );
  const MemberRoute = ({ children }: { children: React.ReactNode }) => (
    <MemberGate>{children}</MemberGate>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AOSInitializer />
      <ToastInitializer />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Routes with Layout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <PageTransition>
                  <Home />
                </PageTransition>
              </MainLayout>
            }
          />
          <Route
            path="/portfolio"
            element={
              <MainLayout>
                <PageTransition>
                  <Portfolio />
                </PageTransition>
              </MainLayout>
            }
          />
          <Route
            path="/portfolio/:slug"
            element={
              <MainLayout>
                <PageTransition>
                  <ProjectDetail />
                </PageTransition>
              </MainLayout>
            }
          />
          <Route
            path="/team"
            element={
              <MainLayout>
                <PageTransition>
                  <Team />
                </PageTransition>
              </MainLayout>
            }
          />
          <Route
            path="/team/:slug"
            element={
              <MainLayout>
                <PageTransition>
                  <TeamMemberDetail />
                </PageTransition>
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <PageTransition>
                  <About />
                </PageTransition>
              </MainLayout>
            }
          />
          
          {/* Admin Routes - Wrapped with AdminLayout */}
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/projects" element={<AdminRoute><ProjectsPage /></AdminRoute>} />
          <Route path="/admin/team" element={<AdminRoute><TeamPage /></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><LogsPage /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
          <Route path="/admin/about" element={<AdminRoute><AboutAdminPage /></AdminRoute>} />
          
          {/* Portfolio Admin Forms with Sidebar */}
          <Route path="/admin/portfolio/new" element={<AdminRoute><PortfolioForm /></AdminRoute>} />
          <Route path="/admin/portfolio/:slug" element={<AdminRoute><PortfolioForm /></AdminRoute>} />
          
          {/* Team Admin Forms with Sidebar */}
          <Route path="/admin/team/new" element={<AdminRoute><TeamForm /></AdminRoute>} />
          <Route path="/admin/team/:slug" element={<AdminRoute><TeamForm /></AdminRoute>} />
          
          {/* Legacy Routes (kept for compatibility) */}
          <Route path="/admin/projects/:slug" element={<AdminRoute><PortfolioEditLegacy /></AdminRoute>} />
          <Route path="/admin/team-member/:slug" element={<AdminRoute><TeamEditLegacy /></AdminRoute>} />

          {/* Member Routes - Wrapped with MemberLayout */}
          <Route path="/member" element={<MemberRoute><MemberDashboard /></MemberRoute>} />
          <Route path="/member/projects" element={<MemberRoute><MemberProjectsPage /></MemberRoute>} />
          <Route path="/member/project" element={<MemberRoute><MemberProjectForm /></MemberRoute>} />
          <Route path="/member/project/:slug" element={<MemberRoute><MemberProjectForm /></MemberRoute>} />
          <Route path="/member/profile" element={<MemberRoute><MemberProfileForm /></MemberRoute>} />
          
          {/* 404 Route */}
          <Route
            path="*"
            element={
              <MainLayout>
                <PageTransition>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                      <p className="text-white/60 text-lg mb-8">Page not found</p>
                      <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                </PageTransition>
              </MainLayout>
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
