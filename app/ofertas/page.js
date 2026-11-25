import ProductCard from '../../components/ProductCard';
import { getOffers } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'Ofertas en iPhone, iPad y Mac en Bogotá', description: 'Aprovecha las mejores ofertas en productos Apple originales: iPhone, iPad, MacBook, Apple Watch y AirPods con precio rebajado en ZonaMac, Bogotá.', alternates: { canonical: '/ofertas' } };
export default async function Ofertas() {
  const ps = await getOffers();
  return <main className="catpage"><h1>Ofertas en productos Apple</h1><p className="sub">Productos Apple originales con precio rebajado, mientras haya unidades.</p><p className="count">{ps.length} {ps.length === 1 ? 'oferta' : 'ofertas'} activas</p><div className="grid">{ps.length ? ps.map(p => <ProductCard key={p.id} p={p} />) : <p>No hay ofertas activas por ahora. Escríbenos por WhatsApp.</p>}</div></main>;
}
