import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/data';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Buscar productos', robots: { index: false, follow: true } };
export default async function Buscar({ searchParams }) {
  const { q = '' } = await searchParams; const ps = q ? await getProducts({ q }) : [];
  return <main className="catpage"><h1>{q ? `Resultados para “${q}”` : 'Buscar productos'}</h1><div className="grid">{ps.length ? ps.map(p => <ProductCard key={p.id} p={p} />) : <p>No encontramos resultados. Prueba con otro nombre o escríbenos por WhatsApp.</p>}</div></main>;
}
