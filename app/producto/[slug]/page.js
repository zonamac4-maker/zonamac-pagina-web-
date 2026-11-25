import { notFound } from 'next/navigation';
import ProductDetail from '../../../components/ProductDetail';
import ProductCard from '../../../components/ProductCard';
import ProductRow from '../../../components/ProductRow';
import Link from 'next/link';
import { getProduct, getRelated, getCategory, sb, available } from '../../../lib/data';
import { SITE, JsonLd, abs, strip, cleanText } from '../../../lib/seo';
export const revalidate = 60;
export async function generateStaticParams() { const { data } = await sb.from('products').select('slug'); return (data || []).map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params; const p = await getProduct(slug);
  if (!p) return { title: 'Producto no encontrado', robots: { index: false } };
  const prices = (p.variants || []).filter(available).map(v => Number(v.precio));
  const from = prices.length ? ' desde $' + Math.min(...prices).toLocaleString('en-US') + ' COP' : '';
  const cond = p.condition === 'semi-nuevo' ? ' seminuevo' : '';
  const title = `Comprar ${p.name}${cond} en Bogotá${from}`;
  const description = strip(cleanText(p.descripcion_corta) || cleanText(p.descripcion_larga), 155) || `${p.name} original con garantía en ZonaMac, Bogotá. Envío a todo Colombia.`;
  const img = abs(p.images?.[0]);
  return { title, description, alternates: { canonical: `/producto/${slug}` },
    openGraph: { type: 'website', title: `${p.name} | ZonaMac`, description, url: `${SITE}/producto/${slug}`, images: img ? [{ url: img, alt: p.name }] : undefined },
    twitter: { card: 'summary_large_image', title: p.name, description, images: img ? [img] : undefined } };
}
const isHtml = t => /<[a-z][\s\S]*>/i.test(t || '');
export default async function Prod({ params }) {
  const { slug } = await params; const p = await getProduct(slug); if (!p) notFound();
  const related = await getRelated(p);
  const cat = p.category_slugs?.length ? await getCategory(p.category_slugs.find(c => c !== 'semi-nuevos' && c !== 'todos-los-iphone') || p.category_slugs[0]) : null;
  const vs = (p.variants || []).filter(v => v.active);
  const avail = vs.filter(available);
  const prices = (avail.length ? avail : vs).map(v => Number(v.precio));
  const until = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  const offer = (v) => ({ '@type': 'Offer', url: `${SITE}/producto/${slug}`, priceCurrency: 'COP', price: Number(v.precio), priceValidUntil: until, itemCondition: p.condition === 'semi-nuevo' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition', availability: available(v) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: 'ZonaMac' } });
  const imgs = [...new Set([...(p.images || []), ...(p.colores || []).flatMap(c => c.imagenes || [])])].slice(0, 8).map(abs);
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Product', name: p.name, description: strip(cleanText(p.descripcion_corta) || cleanText(p.descripcion_larga), 300), image: imgs, sku: vs[0]?.sku || slug, brand: { '@type': 'Brand', name: /pixel/i.test(p.name) ? 'Google' : 'Apple' }, url: `${SITE}/producto/${slug}`,
      offers: prices.length ? { '@type': 'AggregateOffer', priceCurrency: 'COP', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: (avail.length || vs.length), availability: avail.length ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', itemCondition: p.condition === 'semi-nuevo' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition', offers: (avail.length ? avail : vs).slice(0, 20).map(offer) } : undefined },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE }, ...(cat ? [{ '@type': 'ListItem', position: 2, name: cat.name, item: `${SITE}/categoria/${cat.slug}` }] : []), { '@type': 'ListItem', position: cat ? 3 : 2, name: p.name, item: `${SITE}/producto/${slug}` }] }] };
  let larga = (p.descripcion_larga || '').replace(/<h[1-6][^>]*>\s*También te puede interesar\s*<\/h[1-6]>\s*<ul[^>]*>[\s\S]*?<\/ul>/i, '');
  const specs = (p.especificaciones || []).filter(s => s.items?.length);
  return (<main>
    <JsonLd data={ld} />
    <nav className="crumbs pcrumbs" aria-label="Ruta"><Link href="/">Inicio</Link><span>/</span>{cat && <><Link href={'/categoria/' + cat.slug}>{cat.name}</Link><span>/</span></>}<b aria-current="page">{p.name}</b></nav>
    <ProductDetail p={p} />
    <div className="psections">
      {larga && <section className="psec"><h2>Descripción</h2>
        {isHtml(larga) ? <div className="rich" dangerouslySetInnerHTML={{ __html: larga }} /> : <div className="rich">{larga.split(/\n\s*\n/).map((t, i) => <p key={i}>{t}</p>)}</div>}</section>}
      {specs.length > 0 && <section className="psec"><h2>Especificaciones</h2>
        <div className="specgrid">{specs.map(s => (<div className="specgrp" key={s.titulo}><h3>{s.titulo}</h3>
          <dl>{s.items.map((i, n) => <div className="specrow" key={i.k + n}><dt>{i.k}</dt><dd>{i.v}</dd></div>)}</dl></div>))}</div></section>}
      {p.garantia_condiciones && <section className="psec"><h2>Garantía y condiciones</h2><p className="rich">{p.garantia_condiciones}</p></section>}
      {related.length > 0 && <section className="psec related"><h2>También te puede interesar</h2><ProductRow>{related.map(r => <ProductCard key={r.id} p={r} />)}</ProductRow></section>}
    </div></main>);
}
