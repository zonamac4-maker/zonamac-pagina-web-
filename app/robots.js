import { SITE } from '../lib/seo';
export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/carrito', '/buscar', '/api/'] }], sitemap: SITE + '/sitemap.xml', host: SITE };
}
