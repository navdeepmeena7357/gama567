import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { WalletProvider } from '@/context/WalletContext';
import { UserProvider } from '@/context/UserContext';
import { PaymentProvider } from '@/context/PaymentContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Jodi 99',
  description: 'Jodi 99 - Online Matka Play',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppDataProvider>
        <WalletProvider>
          <UserProvider>
            <PaymentProvider>
              <html lang="en">
                <body
                  className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-00`}
                >
                  {children}
                </body>
              </html>
            </PaymentProvider>
          </UserProvider>
        </WalletProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
