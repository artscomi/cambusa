module.exports = {
  siteUrl: "https://www.cambusa-online.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/sign-in*", "/group/create-group"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/sign-in*", "/group/create-group"],
      },
    ],
  },
};
