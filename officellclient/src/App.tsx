
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import { FeedPage } from './pages/FeedPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { VentDetailsPage } from './pages/VentDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import AddUsernamePage from './pages/AddUsernamePage';
import NotFoundPage from './pages/NotFoundPage';
import SessionExpiredPage from './pages/SessionExpiredPage';
import LandscapePrompt from './components/common/LandScapePrompt';
import { Slide, ToastContainer } from 'react-toastify';

function RequireAuth({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${import.meta.env.VITE_API}/profile`, { withCredentials: true, signal: controller.signal })
      .then(() => setAuthenticated(true))
      .catch(error => { if (!axios.isCancel(error)) setAuthenticated(false); });
    return () => controller.abort();
  }, []);
  if (authenticated === null) return <div className="min-h-screen bg-[#020817]" aria-label="Checking session" />;
  return authenticated ? children : <Navigate to="/sessionexpired" replace />;
}

function App() {

  return (
    <>
      <LandscapePrompt />
      <ToastContainer position="bottom-center" theme="dark" autoClose={3000} hideProgressBar icon={false} closeButton={false} transition={Slide} closeOnClick pauseOnHover draggable={false} limit={2} />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>} ></Route>
        <Route path="/login" element={<LoginPage></LoginPage>} ></Route>
        <Route path="/username" element={<AddUsernamePage></AddUsernamePage>} ></Route>
        <Route path="/feed" element={<RequireAuth><FeedPage /></RequireAuth>} />
        <Route path="/trending" element={<Navigate to="/feed?sort=hot" replace />} />
        <Route path="/companies" element={<RequireAuth><CompaniesPage /></RequireAuth>} />
        <Route path="/companies/:id" element={<RequireAuth><CompanyDetailsPage /></RequireAuth>} />
        <Route path="/companies/register" element={<RequireAuth><RegisterCompanyPage /></RequireAuth>} />
        <Route path="/vent/:id" element={<RequireAuth><VentDetailsPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/sessionexpired" element={ <SessionExpiredPage></SessionExpiredPage>} ></Route>       
        <Route path="/admin/reports" element={<AdminReportsPage></AdminReportsPage>} ></Route>       
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </>
  
  );
}

export default App;
