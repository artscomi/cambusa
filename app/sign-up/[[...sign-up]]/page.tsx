import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        layout: {
          termsPageUrl: "/terms",
          privacyPageUrl: "/privacy-policy",
        },
      }}
    />
  );
}
