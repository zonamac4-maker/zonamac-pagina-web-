import { createClient } from '@supabase/supabase-js';
export const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
export const WA = 'https://api.whatsapp.com/send?phone=573143574547&text=';
export const MAPS = 'https://maps.app.goo.gl/7W5qNLqkhDwe3a1H9';
export const money = n => '$' + Number(n).toLocaleString('en-US');
export async function getMenu() {
  const { data, error } = await sb.from('categories').select('slug,name').eq('show_in_menu', true).order('position'); if (error) console.error('getMenu', JSON.stringify(error));
  return data || [];
}
export async function getProducts({ category, featured, q } = {}) {
  let r = sb.from('products').select('*, variants(*)').order('position');
  if (category) r = r.contains('category_slugs', [category]);
  if (featured) r = r.eq('featured', true);
  if (q) r = r.ilike('name', '%' + q.replace(/[%,]/g, '') + '%');
  const { data } = await r;
  return data || [];
}
export async function getProduct(slug) {
  const { data } = await sb.from('products').select('*, variants(*)').eq('slug', slug).maybeSingle();
  return data;
}
export async function getCategory(slug) {
  const { data } = await sb.from('categories').select('slug,name').eq('slug', slug).maybeSingle();
  return data;
}

export const available = v => v.active && v.stock !== 0;
// Variante sin precio publicado: se cotiza por WhatsApp (attrs._consultar)
export const isQuote = v => !!(v.attrs && v.attrs._consultar);
export const priced = v => available(v) && !isQuote(v);
export function priceInfo(p) {
  const v = (p.variants || []).filter(priced);
  if (!v.length) return (p.variants || []).some(x => available(x) && isQuote(x)) ? { soldout: false, quote: true } : { soldout: true };
  const ps = v.map(x => Number(x.precio)), min = Math.min(...ps), max = Math.max(...ps);
  const best = v.find(x => Number(x.precio) === min);
  return { soldout: false, min, max, from: min !== max, sale: !!best.precio_anterior, was: best.precio_anterior ? Number(best.precio_anterior) : null };
}
export async function getBanners() {
  const { data } = await sb.from('banners').select('*').order('position');
  if (!data?.length) return [];
  const slugs = data.map(b => b.product_slug).filter(Boolean);
  const { data: ps } = await sb.from('products').select('slug,name,images,variants(*)').in('slug', slugs);
  const by = Object.fromEntries((ps || []).map(p => [p.slug, p]));
  return data.map(b => ({ ...b, product: by[b.product_slug] || null }));
}
export async function getOffers() {
  const all = await getProducts();
  return all.filter(p => (p.variants || []).some(v => available(v) && v.precio_anterior));
}

export async function getRelated(p, limit = 8) {
  const { data } = await sb.from('products').select('*, variants(*)').overlaps('category_slugs', p.category_slugs).neq('id', p.id).order('position');
  const mine = new Set(p.category_slugs);
  const stem = n => n.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9áéíóúñ ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const w0 = new Set(stem(p.name));
  const score = x => x.category_slugs.filter(c => mine.has(c)).length * 2 + (x.condition === p.condition ? 1 : 0) + stem(x.name).filter(w => w0.has(w)).length * 0.5
    + ((x.variants || []).some(available) ? 1 : -5);
  return (data || []).sort((a, b) => score(b) - score(a)).slice(0, limit);
}
