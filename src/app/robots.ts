import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dcccorner.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dcc-hq/', '/api/admin/'], // disallow admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
