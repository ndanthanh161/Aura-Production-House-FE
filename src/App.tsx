import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { RoleGuard } from './components/RoleGuard';

import Home from './pages/public/Home/Home';
import Portfolio from './pages/public/Portfolio';
import Services from './pages/public/Services';
import Packages from './pages/public/Packages';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import PurchasePackage from './pages/public/PurchasePackage';
import MyBookings from './pages/public/MyBookings';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

import { PhotographerLayout } from './layouts/PhotographerLayout';
import PhotographerOverview from './pages/photographer/Overview';
import PhotographerProjects from './pages/photographer/Projects';
import PhotographerProfile from './pages/photographer/Profile';

import { AdminLayout } from './layouts/AdminLayout';
import AdminOverview from './pages/admin/Overview';

import AdminPackages from './pages/admin/Packages';
import AdminUsers from './pages/admin/Users';
import AdminPhotographers from './pages/admin/Photographers';
import AdminBookings from './pages/admin/Bookings';
import AdminCustomers from './pages/admin/Customers';
import AdminStatistics from './pages/admin/Statistics';
import AdminAIKnowledge from './pages/admin/AIKnowledge';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminContactMessages from './pages/admin/ContactMessages';

import { ScrollToTop } from './components/ScrollToTop';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <>
      <ScrollToTop />
      <ChatWidget />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="packages" element={<Packages />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="purchase/:packageId" element={<PurchasePackage />} />
          <Route path="projects" element={<MyBookings />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Photographer Routes */}
        <Route
          path="/photographer"
          element={
            <RoleGuard allowedRoles={['photographer']}>
              <PhotographerLayout />
            </RoleGuard>
          }
        >
          <Route index element={<PhotographerOverview />} />
          <Route path="projects" element={<PhotographerProjects />} />
          <Route path="profile" element={<PhotographerProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route index element={<AdminOverview />} />

          <Route path="packages" element={<AdminPackages />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="photographers" element={<AdminPhotographers />} />
          <Route path="projects" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="ai" element={<AdminAIKnowledge />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="contacts" element={<AdminContactMessages />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
