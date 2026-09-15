import type { Metadata } from 'next';
import './globals.css';
import { getTheme, themeToCss } from '@/lib/theme';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: `${theme.siteName} | ${theme.tagline}`,
    description: 'High-converting digital marketplace for premium e-books, guides, and PDF knowledge assets with direct Razorpay checkout.',
    openGraph: {
      title: theme.siteName,
      description: theme.tagline,
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  const dynamicCss = themeToCss(theme);

  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar siteName={theme.siteName} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer siteName={theme.siteName} />
      </body>
    </html>
  );
}