import Link from 'next/link';
import { priceInfo, money } from '../lib/data';
export default function ProductCard({ p, priority = false }) {
  const i = priceInfo(p);
  const tag = i.soldout ? 'AGOTADO' : i.sale ? 'OFERTA' : p.condition === 'semi-nuevo' ? 'SEMI NUEVO' : 'NUEVO';
  return (<Link className="card" href={`/producto/${p.slug}`}>
    <span className={'tag t-' + tag.toLowerCase().replace(' ', '-')}>{tag}</span>
    <img loading={priority ? 'eager' : 'lazy'} decoding="async" width="400" height="400" src={p.images?.[0]} alt={`${p.name} - ${p.condition === 'semi-nuevo' ? 'semi nuevo' : 'nuevo'} en ZonaMac`} />
    <span className="nm">{p.name}</span>
    <span className="pr">{i.soldout ? 'Consultar disponibilidad' : <>{i.from ? 'Desde ' : ''}{i.was && <del>{money(i.was)}</del>}{money(i.min)} COP</>}</span>
    <span className="cbtn2">{i.soldout ? 'Consultar' : 'Ver opciones'}</span>
  </Link>);
}
