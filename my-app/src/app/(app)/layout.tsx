import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  );
}