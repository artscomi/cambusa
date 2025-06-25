import "/styles/globals.css";
import ContextLayout from "./context-layout";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import { baloo, bebas, montserrat } from "@/styles/fonts";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsentProvider } from "../components/CookieConsent/CookieConsentProvider";

export const metadata = {
  title:
    "Cambusaai - Crea la cambusa perfetta per la tua vacanza in barca a vela",
  description:
    "Cerchi idee per organizzare la cambusa della tua vacanza in barca a vela? Con Cambusa AI puoi creare un menu personalizzato, modificare i piatti e generare una lista cambusa completa per una settimana in barca, il tutto facilmente online. Pianifica la cambusa perfetta e scopri come fare cambusa online per un viaggio senza pensieri!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <ClerkProvider dynamic>
      <html
        lang="it"
        className={`${montserrat.variable} ${baloo.variable} ${bebas.variable} overflow-x-hidden`}
      >
        <head>
          <meta name="theme-color" content="#0895c5" />
          {/* Hotjar - Solo se l'utente ha accettato i cookie analitici */}
          {isProduction && (
            <Script id="hotjar" strategy="afterInteractive">
              {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6380619,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
            </Script>
          )}
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="0936IsFm5X3AsXRbCcwqZw"
            strategy="afterInteractive"
          />
          <link
            rel="canonical"
            href="https://www.cambusa-online.com"
            key="canonical"
          />
          <meta
            name="google-site-verification"
            content="jxyENPJP2buWH0c24EdNAvA0ewUp2e-ZJghVYeOL_aU"
          />
        </head>
        <body className="font-subtitle text-default flex flex-col min-h-screen max-w-screen overflow-hidden relative max-sm:bg-white antialiased">
          <CookieConsentProvider>
            <ContextLayout>
              <Header />
              <main className="pt-[75px] md:pt-20 overflow-auto flex-1 w-full">
                {children}
              </main>
            </ContextLayout>

            {/* Mobile: Nice Background */}
            <div
              className="sm:hidden fixed inset-0 -z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23eef8ff' fill-opacity='0.4' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3Cpath fill='%23daf0ff' fill-opacity='0.3' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3Cpath fill='%23daf0ff' fill-opacity='0.2' d='M0,288L48,277.3C96,267,192,245,288,234.7C384,224,480,224,576,234.7C672,245,768,267,864,272C960,277,1056,267,1152,256C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
              }}
            ></div>

            {/* Desktop: Background Image */}
            <Image
              alt=""
              src="/bg.png"
              fill
              className="object-cover -z-10 hidden sm:block"
              style={{
                imageRendering: "-webkit-optimize-contrast",
              }}
              quality={100}
              priority
            />

            <Footer />
          </CookieConsentProvider>
        </body>
        <SpeedInsights />
      </html>
    </ClerkProvider>
  );
}
