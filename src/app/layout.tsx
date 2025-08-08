import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from '@/components/app-providers';
import { AppShell } from '@/components/app-shell';
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'InterviewAce',
  description: 'AI-powered mock interview agent to help you ace your next interview.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </AuthProvider>
        </AppProviders>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
