export const isInWebview = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("instagram") ||
    ua.includes("fbav") ||
    ua.includes("line") ||
    ua.includes("tiktok") ||
    ua.includes("snapchat")
  );
};
