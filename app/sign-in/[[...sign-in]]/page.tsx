import { SignIn } from "@clerk/nextjs";
import { isInWebview } from "@/app/utils";

export default function Page() {
  if (typeof window !== "undefined" && isInWebview()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Accesso non disponibile</h1>
        <p className="text-gray-600">
          Per accedere a Cambusa, ti preghiamo di utilizzare un browser web
          standard.
        </p>
      </div>
    );
  }

  return (
    <SignIn
      appearance={{
        elements: {
          socialButtonsBlockButton: {
            display:
              typeof window !== "undefined" && isInWebview() ? "none" : "block",
          },
          footerActionLink: {
            color: "var(--clerk-primary)",
          },
        },
        layout: {
          termsPageUrl: "/termini",
          privacyPageUrl: "/privacy",
        },
      }}
    />
  );
}
