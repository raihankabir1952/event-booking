// frontend/app/layout.tsx

import './globals.css'; // Tailwind CSS গ্লোবাল ফাইল
import 'react-toastify/dist/ReactToastify.css'; // 👈 Toastify CSS ইমপোর্ট করা হয়েছে
import { ToastContainer } from 'react-toastify'; // 👈 ToastContainer ইমপোর্ট করা হয়েছে
import { Inter } from 'next/font/google';
import Header from './components/Header';
import { AuthProvider } from './components/AuthContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EventFlow Booking App',
  description: 'Event management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> 
          <Header />
          <main>{children}</main>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> {/* 👈 এটি যোগ করা হয়েছে */}
        </AuthProvider>
      </body>
    </html>
  );
}
