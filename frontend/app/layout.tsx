// app/layout.tsx (o el nombre que uses para tu RootLayout en Next.js 13+)
import './globals.css';
import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import Script from 'next/script';
import {SidebarDemo} from '@/components/sidebar-demo';
import {ClientWrapper} from '@/components/ClientWrapper';
import { AppointmentProvider } from "@/context/appointmentContext";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Fisio Find | Tu fisioterapeuta online en España',
  description: 'Conecta con fisioterapeutas especializados en rehabilitación, lesiones musculares y fisioterapia para mayores. Sesiones presenciales y online en toda España.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta
          name="google-site-verification"
          content="Bpr044aEZj4eM5dgE2A8474JvW_iED_Akm2cZSD5c2M"
        />
        <meta
          name="keywords"
          content="fisioterapeuta, fisioterapeuta online, fisioterapia, salud, telemedicina, rehabilitación de lesiones, fisioterapia para mayores, ejercicio físico"
        />

         <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WNVDSD7MBJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-WNVDSD7MBJ');
          `}
        </Script>
        <Script
          src="https://animatedicons.co/scripts/embed-animated-icons.js"
          strategy="afterInteractive"
        />
        <Script
          id="userway-widget"
          src="https://cdn.userway.org/widget.js"
          data-account="436w0GnIfK"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        style={{ backgroundColor: "rgb(238, 251, 250)" }}
      >
        <AppointmentProvider>
          <ClientWrapper>
            <div className="flex min-h-screen" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
              <SidebarDemo />
              <main className="flex-1 transition-all duration-300 h-screen overflow-auto" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
                {children}
              </main>
            </div>
          </ClientWrapper>
        </AppointmentProvider>
      </body>
    </html>
  );
}
