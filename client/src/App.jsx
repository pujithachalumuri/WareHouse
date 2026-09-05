import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import FindWarehouse from './pages/public/FindWarehouse';
import WarehouseDetails from './pages/public/WarehouseDetails';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer
import CustomerDashboard from './pages/customer/Dashboard';
import MyBookings from './pages/customer/MyBookings';
import BookingDetails from './pages/customer/BookingDetails';
import Inventory from './pages/customer/Inventory';
import Agreements from './pages/customer/Agreements';
import Payments from './pages/customer/Payments';
import Profile from './pages/customer/Profile';
import Notifications from './pages/customer/Notifications';
import AccessLogs from './pages/customer/AccessLogs';

// Owner
import ListWarehouse from './pages/public/ListWarehouse';
import OwnerDashboard from './pages/owner/Dashboard';
import MyWarehouses from './pages/owner/MyWarehouses';
import AddWarehouse from './pages/owner/AddWarehouse';
import EditWarehouse from './pages/owner/EditWarehouse';
import BookingRequests from './pages/owner/BookingRequests';
import OwnerCustomers from './pages/owner/Customers';
import Revenue from './pages/owner/Revenue';
import OwnerAgreements from './pages/owner/Agreements';
import OwnerProfile from './pages/owner/OwnerProfile';

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/find" element={<FindWarehouse />} />
        <Route path="/warehouse/:id" element={<WarehouseDetails />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/list-warehouse" element={<ListWarehouse />} />

        {/* Customer */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute roles={['customer']}><MyBookings /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute roles={['customer', 'owner']}><BookingDetails /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute roles={['customer']}><Inventory /></ProtectedRoute>} />
        <Route path="/agreements" element={<ProtectedRoute roles={['customer']}><Agreements /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute roles={['customer']}><Payments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute roles={['customer', 'owner']}><Notifications /></ProtectedRoute>} />
        <Route path="/access-logs" element={<ProtectedRoute roles={['customer']}><AccessLogs /></ProtectedRoute>} />

        {/* Owner */}
        <Route path="/owner-dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/my-warehouses" element={<ProtectedRoute roles={['owner']}><MyWarehouses /></ProtectedRoute>} />
        <Route path="/add-warehouse" element={<ProtectedRoute roles={['owner']}><AddWarehouse /></ProtectedRoute>} />
        <Route path="/edit-warehouse/:id" element={<ProtectedRoute roles={['owner']}><EditWarehouse /></ProtectedRoute>} />
        <Route path="/booking-requests" element={<ProtectedRoute roles={['owner']}><BookingRequests /></ProtectedRoute>} />
        <Route path="/owner-customers" element={<ProtectedRoute roles={['owner']}><OwnerCustomers /></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute roles={['owner']}><Revenue /></ProtectedRoute>} />
        <Route path="/owner-agreements" element={<ProtectedRoute roles={['owner']}><OwnerAgreements /></ProtectedRoute>} />
        <Route path="/owner-profile" element={<ProtectedRoute roles={['owner']}><OwnerProfile /></ProtectedRoute>} />

        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
