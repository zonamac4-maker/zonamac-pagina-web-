import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import { getProducts, getCategory, sb, priceInfo } from '../../../lib/data';
import { CAT_SEO, JsonLd, SITE, abs } from '../../../lib/seo';
export const revalidate = 60;
export async function generateStaticParams() { const { data } = await sb.from('categories').select('slug'); return (data || []).map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params; const c = await getCategory(slug); if (!c) return { title: 'Categoría no encontrada', robots: { index: false } };
  const seo = CAT_SEO[slug];
  const title = seo ? seo[0] : `${c.name} originales en Bogotá`;
  const description = seo ? seo[1] : `Compra ${c.name} originales con garantía en Bogotá. Envío a toda Colombia y asesoría por WhatsApp en ZonaMac.`;
  return { title, description, alternates: { canonical: `/categoria/${slug}` }, openGraph: { title: title + ' | ZonaMac', description, url: `${SITE}/categoria/${slug}`, type: 'website' } };
}
export default async function Cat({ params }) {
  const { slug } = await params; const c = await getCategory(slug); if (!c) notFound();
  const ps = await getProducts({ category: slug });
  const seo = CAT_SEO[slug];
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE }, { '@type': 'ListItem', position: 2, name: c.name, item: `${SITE}/categoria/${slug}` }] },
    { '@type': 'CollectionPage', name: seo ? seo[0] : c.name, url: `${SITE}/categoria/${slug}`, mainEntity: { '@type': 'ItemList', numberOfItems: ps.length, itemListElement: ps.slice(0, 30).map((p, n) => ({ '@type': 'ListItem', position: n + 1, url: `${SITE}/producto/${p.slug}`, name: p.name, image: abs(p.images?.[0]) })) } }] };
  return <main className="catpage"><JsonLd data={ld} />
    <nav className="crumbs" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span><b aria-current="page">{c.name}</b></nav>
    <h1>{seo ? seo[0] : c.name}</h1>{seo && <p className="sub">{seo[2]}</p>}
    <p className="count">{ps.length} {ps.length === 1 ? 'producto' : 'productos'}</p>
    <div className="grid">{ps.length ? ps.map((p, n) => <ProductCard key={p.id} p={p} priority={n < 4} />) : <p>Sin productos por ahora. Escríbenos por WhatsApp y te ayudamos.</p>}</div></main>;
}
