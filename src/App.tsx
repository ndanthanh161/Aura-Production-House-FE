import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { RoleGuard } from './components/RoleGuard';

import Home from './pages/public/Home/Home';
import Portfolio from './pages/public/Portfolio';
import Services from './pages/public/Services';
import Packages from './pages/public/Packages';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Payment from './pages/public/Payment';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import { StaffLayout } from './layouts/StaffLayout';
import StaffOverview from './pages/staff/Overview';
import StaffProjects from './pages/staff/Projects';
import StaffProfile from './pages/staff/Profile';

import { PhotographerLayout } from './layouts/PhotographerLayout';
import PhotographerOverview from './pages/photographer/Overview';
import PhotographerProjects from './pages/photographer/Projects';
import PhotographerProfile from './pages/photographer/Profile';

import { AdminLayout } from './layouts/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminProjects from './pages/admin/Projects';
import AdminPackages from './pages/admin/Packages';
import AdminUsers from './pages/admin/Users';
import AdminPhotographers from './pages/admin/Photographers';
import AdminBookings from './pages/admin/Bookings';
import AdminCustomers from './pages/admin/Customers';
import AdminStatistics from './pages/admin/Statistics';

import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="packages" element={<Packages />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="payment" element={<Payment />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <RoleGuard allowedRoles={['staff']}>
              <StaffLayout />
            </RoleGuard>
          }
        >
          <Route index element={<StaffOverview />} />
          <Route path="projects" element={<StaffProjects />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>

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
          <Route path="projects" element={<AdminProjects />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="photographers" element={<AdminPhotographers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
