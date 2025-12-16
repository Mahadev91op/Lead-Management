export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // API routes ko google search me nahi dikhana
    },
    sitemap: 'https://devsamp.com/sitemap.xml',
  }
}