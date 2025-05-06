import "/styles/globals.css";
import ContextLayout from "./context-layout";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import { baloo, bebas, montserrat } from "@/styles/fonts";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title:
    "Cambusa Ai - Crea la cambusa perfetta per la tua vacanza in barca a vela",
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
          {/* Hotjar */}
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
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="0936IsFm5X3AsXRbCcwqZw"
            strategy="afterInteractive"
          />
          {isProduction && (
            <Script
              id="clarity-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
             (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "paqf1qkf3c");
            `,
              }}
            />
          )}
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
            }}
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
          <ContextLayout>
            <Header />
            <main className="pt-[75px] px-4 md:px-10 md:pt-20 lg:px-0 m-auto max-w-[1024px] overflow-auto flex-1 w-full">
              {children}
            </main>
          </ContextLayout>
          <Image
            alt=""
            src="/bg.png"
            fill
            className="object-cover -z-10 hidden sm:block"
          />
          <Footer />
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}
