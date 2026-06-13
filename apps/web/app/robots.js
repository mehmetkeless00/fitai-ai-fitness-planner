const BASE_URL = 'https://fitai-ai-fitness-planner.vercel.app';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Result pages are per-user (localStorage-driven) — nothing useful to index
      disallow: '/result',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
