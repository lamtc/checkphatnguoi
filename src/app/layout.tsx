import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './bootstrap';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tra cứu vi phạm giao thông',
  description: 'Tra cứu thông tin vi phạm giao thông',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
