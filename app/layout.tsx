import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/Alert';
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}
console.log("layout.tsx")
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <AlertProvider>

              <body>{children}</body>

          </AlertProvider>
        </AuthProvider>

      </ThemeProvider>

    </html>
  )
}
