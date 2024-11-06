import "/styles/globals.css";
import ContextLayout from "./context-layout";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import { baloo, bebas, montserrat } from "@/styles/fonts";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";

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
  return (
    <ClerkProvider>
      <html
        lang="it"
        className={`${montserrat.variable} ${baloo.variable} ${bebas.variable} overflow-x-hidden`}
      >
        <head>
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
        <body className="font-subtitle text-default flex flex-col min-h-screen max-w-screen overflow-hidden relative max-sm:bg-white">
          <Header />
          <main className="py-[75px] px-4 md:px-10 md:pt-20 lg:px-0 m-auto max-w-[1024px] overflow-auto flex-1 w-full">
            <ContextLayout>{children}</ContextLayout>
          </main>
          <Image
            alt=""
            src="/bg.png"
            fill
            className="object-cover -z-10 hidden sm:block"
          />
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}
