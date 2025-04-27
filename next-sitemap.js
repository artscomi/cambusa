// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cambusa-online.com', // tuo dominio
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [], // se vuoi escludere delle route tipo '/admin'
  transform: async (config, path) => {
    // Customizzazione dei campi nella sitemap
    return {
      loc: path, // URL della pagina
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
