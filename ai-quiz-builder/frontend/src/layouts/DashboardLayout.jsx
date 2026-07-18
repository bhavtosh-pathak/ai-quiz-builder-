import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-paper bg-grid-lines bg-[size:24px_24px]">
    <Navbar />
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    <Footer />
  </div>
);

export default DashboardLayout;
