export const isInWebview = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("instagram") ||
    ua.includes("fbav") ||
    ua.includes("line") ||
    ua.includes("tiktok") ||
    ua.includes("snapchat")
  );
};
