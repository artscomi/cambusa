"use client";

import { useEffect } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { GA_TRACKING_ID } from "@/lib/gtag";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

export const Analytics: React.FC = () => {
  const { canLoadAnalytics, isLoaded, isMounted } = useCookieConsent();

  useEffect(() => {
    if (!isLoaded || !isMounted) return;

    if (canLoadAnalytics()) {
      // Carica Google Analytics
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_title: document.title,
          page_location: window.location.href,
        });
      `;
      document.head.appendChild(script2);

      // Carica Microsoft Clarity
      const script3 = document.createElement("script");
      script3.type = "text/javascript";
      script3.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
      `;
      document.head.appendChild(script3);

      // Cleanup function
      return () => {
        // Rimuovi gli script quando il componente viene smontato
        const scripts = document.querySelectorAll(
          'script[src*="googletagmanager"], script[src*="clarity"]'
        );
        scripts.forEach((script) => script.remove());
      };
    }
  }, [canLoadAnalytics, isLoaded, isMounted]);

  return null; // Questo componente non renderizza nulla
};
