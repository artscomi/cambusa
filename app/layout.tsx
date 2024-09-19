import "/styles/globals.css";
import ContextLayout from "./context-layout";
import { ClerkProvider } from "@clerk/nextjs";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { baloo, bebas, montserrat } from "@/styles/fonts";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Cambusa Ai",
  description: "Generated by Next.js",
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
        </head>
        <body className="font-subtitle text-default flex flex-col min-h-screen max-w-screen overflow-hidden relative max-sm:bg-white">
          <main className="py-10 px-4 md:px-10 md:pt-20 lg:px-0 m-auto max-w-[1024px] overflow-auto flex-1 w-full">
            <ContextLayout>{children}</ContextLayout>
          </main>
          {/* <Footer /> */}
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
