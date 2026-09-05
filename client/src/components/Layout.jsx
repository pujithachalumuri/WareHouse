import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastHost from './Toast';
import DBBanner from './DBBanner';

export default function Layout({ children }) {
  const location = useLocation();
  const isDash = location.pathname.includes('dashboard') || [
    '/my-bookings', '/booking', '/inventory', '/agreements', '/payments', '/profile',
    '/notifications', '/my-warehouses', '/add-warehouse', '/edit-warehouse',
    '/booking-requests', '/revenue', '/users', '/verification', '/manage-warehouses',
    '/manage-bookings', '/manage-payments', '/complaints', '/reviews', '/reports',
    '/access-logs', '/customer-details', '/owner-customers',
  ].some((p) => location.pathname.startsWith(p));

  return (
    <>
      <ToastHost />
      <DBBanner />
      {!isDash ? (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
        </>
      )}
    </>
  );
}
