import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Cambusaai",
  description:
    "Consigli e guide per la gestione della cambusa in barca. Scopri ricette, organizzazione e suggerimenti per navigare con gusto.",
  keywords:
    "blog cambusa, ricette barca, organizzazione cambusa, mal di mare, pasti veloci barca",
  openGraph: {
    title: "Blog - Cambusaai",
    description: "Consigli e guide per la gestione della cambusa in barca",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
