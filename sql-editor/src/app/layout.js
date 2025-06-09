import { Inter } from 'next/font/google';
import './globals.css' ;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SQL Editor - Build, Test, and Execute SQL Queries',
  description: 'A powerful online SQL editor for writing, testing, and executing SQL queries with an intuitive interface.',
  keywords: 'SQL, editor, database, query, online, tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
