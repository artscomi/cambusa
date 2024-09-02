import type { AppProps } from "next/app";
import "../app/globals.css";
import { MealContextProvider } from "@/context/useMealContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MealContextProvider>
      <Component {...pageProps} />
    </MealContextProvider>
  );
}
