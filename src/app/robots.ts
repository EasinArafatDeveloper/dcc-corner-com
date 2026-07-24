import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://dcccorner.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dcc-hq/', '/api/admin/'], // disallow admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
