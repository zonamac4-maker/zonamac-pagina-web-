import { sb } from '../lib/data';
import { SITE } from '../lib/seo';
export const revalidate = 3600;
export default async function sitemap() {
  const [{ data: ps }, { data: cs }] = await Promise.all([sb.from('products').select('slug,images'), sb.from('categories').select('slug')]);
  const now = new Date();
  const fixed = [['', 1, 'daily'], ['/ofertas', .9, 'daily'], ['/soporte-tecnico', .6, 'monthly']].map(([p, priority, changeFrequency]) => ({ url: SITE + p, lastModified: now, changeFrequency, priority }));
  return [...fixed,
    ...(cs || []).map(c => ({ url: `${SITE}/categoria/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: .8 })),
    ...(ps || []).map(p => ({ url: `${SITE}/producto/${p.slug}`, lastModified: now, changeFrequency: 'weekly', priority: .7 }))];
}
