import type { MetadataRoute } from "next";

/** Manifest dell'app: nome, colori e icone quando si aggiunge il sito alla schermata Home. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cambusa - La cambusa perfetta per la tua barca",
    short_name: "Cambusa",
    description:
      "Menu e lista della spesa per la tua vacanza in barca a vela, da preparare insieme alla crew.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0895c5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
