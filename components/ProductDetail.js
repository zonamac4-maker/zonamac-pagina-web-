'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readCart, writeCart } from './CartButton';
import { WA, money, available } from '../lib/data';
import { cleanText } from '../lib/seo';
import { IconShield, IconWhatsApp } from './Icons';

const unitVal = s => { const m = /([\d.,]+)\s*(TB|GB|MM)?/i.exec(s || ''); if (!m) return 0; const n = parseFloat(m[1].replace(',', '.')); return /TB/i.test(m[2] || '') ? n * 1024 : n; };
const ordered = a => [...a].sort((x, y) => unitVal(x) - unitVal(y) || String(x).localeCompare(String(y)));

export default function ProductDetail({ p }) {
  const router = useRouter();
  const variants = p.variants || [];
  const colors = useMemo(() => {
    const names = [...new Set(variants.map(v => v.color).filter(Boolean))];
    return names.map(n => (p.colores || []).find(c => c.nombre === n) || { nombre: n, hex: '#c8ccd2', imagenes: [] });
  }, [p]);
  const extraKeys = useMemo(() => [...new Set(variants.flatMap(v => Object.keys(v.attrs || {})))], [p]);
  const dims = useMemo(() => [
    ...(colors.length ? ['color'] : []),
    ...(variants.some(v => v.almacenamiento) ? ['almacenamiento'] : []),
    ...extraKeys,
  ], [p]);
  const get = (v, d) => d === 'color' ? v.color : d === 'almacenamiento' ? v.almacenamiento : (v.attrs || {})[d];
  const label = d => d === 'color' ? 'Color' : d === 'almacenamiento' ? p.etiqueta_almacenamiento : d;
  const values = d => { const vals = [...new Set(variants.map(v => get(v, d)).filter(Boolean))]; return d === 'almacenamiento' ? ordered(vals) : vals; };
  const toSel = v => Object.fromEntries(dims.map(d => [d, get(v, d)]));
  const cIdx = c => { const i = colors.findIndex(x => x.nombre === c); return i < 0 ? 99 : i; };
  const first = [...variants].sort((a, b) => cIdx(a.color) - cIdx(b.color) || unitVal(a.almacenamiento) - unitVal(b.almacenamiento)).find(available) || variants[0];
  const [sel, setSel] = useState(first ? toSel(first) : {});
  const [idx, setIdx] = useState(0);

  const cur = variants.find(v => dims.every(d => get(v, d) === sel[d]));
  const ok = cur && available(cur);
  const anyAvail = variants.some(available);
  const W = d => d === 'color' ? 4 : d === 'almacenamiento' ? 2 : 1;
  // color y almacenamiento se bloquean entre sí; las demás opciones (RAM, batería, etc.) solo exigen que exista alguna unidad disponible
  const enabled = (d, o) => variants.some(v => available(v) && get(v, d) === o && (d !== 'almacenamiento' || !dims.includes('color') || v.color === sel.color));

  function choose(d, o) {
    if (!enabled(d, o)) return;
    const cands = variants.filter(v => available(v) && get(v, d) === o);
    const score = v => dims.filter(e => e !== d && get(v, e) === sel[e]).reduce((a, e) => a + W(e), 0);
    const best = [...cands].sort((a, b) => score(b) - score(a))[0];
    if (best) setSel(toSel(best));
    if (d === 'color' || (best && best.color !== sel.color)) setIdx(0);
  }

  const color = colors.find(c => c.nombre === sel.color);
  const gallery = (color && color.imagenes && color.imagenes.length) ? color.imagenes : (p.images || []);
  const img = gallery[Math.min(idx, gallery.length - 1)];

  const range = (() => { const ps = variants.filter(available).map(v => Number(v.precio)); return ps.length ? [Math.min(...ps), Math.max(...ps)] : null; })();
  let priceEl;
  if (cur) priceEl = <>{cur.precio_anterior && <del>{money(cur.precio_anterior)}</del>}{money(cur.precio)}</>;
  else if (range) priceEl = range[0] === range[1] ? money(range[0]) : money(range[0]) + ' – ' + money(range[1]);
  else priceEl = 'Agotado';

  const parts = [sel.almacenamiento, sel.color, ...extraKeys.map(k => sel[k])].filter(Boolean);
  const msg = `Hola Zona Mac, me interesa el ${p.name}${parts.length ? ' - ' + parts.join(' - ') : ''}${ok ? ' por ' + money(cur.precio) : ''}`;

  function add() {
    if (!ok) return;
    const c = readCart(), key = p.slug + '|' + (cur.sku || parts.join('|')), f = c.find(i => i.k === key);
    if (f) f.qty++; else c.push({ k: key, name: p.name, opts: parts.join(' · '), price: Number(cur.precio), qty: 1, sku: cur.sku || null });
    writeCart(c); router.push('/carrito');
  }

  return (<div className="prod">
    <div className="pgal">
      <img id="main" src={img} width="800" height="800" fetchPriority="high" alt={p.name + (sel.color ? ' ' + sel.color : '')} />
      {gallery.length > 1 && <div className="thumbs">{gallery.map((s, n) => <button key={s} type="button" className={'th' + (n === idx ? ' on' : '')} aria-label={`Ver foto ${n + 1}`} onClick={() => setIdx(n)}><img src={s} alt="" width="64" height="64" loading="lazy" /></button>)}</div>}
    </div>
    <div className="pinfo">
      <h1>{p.name}</h1>
      {p.descripcion_corta && <p className="sd">{cleanText(p.descripcion_corta)}</p>}
      <p className="pprice">{priceEl}</p>
      {!anyAvail && <p className="soldout"><b>Agotado por ahora.</b> Escríbenos por WhatsApp para consultar disponibilidad.</p>}
      {dims.map(d => d === 'color' ? (
        <div className="opt" key={d}><div className="optl">Color: <b>{sel.color}</b></div>
          <div className="swatches">{colors.map(c => <button key={c.nombre} type="button" title={c.nombre} aria-label={c.nombre} aria-pressed={sel.color === c.nombre}
            className={'sw' + (sel.color === c.nombre ? ' on' : '') + (enabled('color', c.nombre) ? '' : ' off')} onClick={() => choose('color', c.nombre)}><i style={{ background: c.hex }} /></button>)}</div></div>
      ) : (
        <div className="opt" key={d}><div className="optl">{label(d)}: <b>{sel[d]}</b></div>
          <div className="pills">{values(d).map(o => <button key={o} type="button" aria-pressed={sel[d] === o} disabled={!enabled(d, o)}
            className={'pill' + (sel[d] === o ? ' on' : '')} onClick={() => choose(d, o)}>{o}</button>)}</div></div>
      ))}
      {cur && !ok && anyAvail && <p className="soldout">Esta combinación está agotada.</p>}
      <div className="row">
        <button id="add" type="button" disabled={!ok} onClick={add}>Añadir al carrito</button>
        <a className="wabtn" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener"><IconWhatsApp size={18} /> Pedir por WhatsApp</a>
      </div>
      {cur && cur.sku && <p className="skuline">SKU: {cur.sku}</p>}
      {p.garantia_condiciones && <p className="warr"><IconShield size={18} /> {p.garantia_condiciones.split('. ')[0].replace(/\.$/, '')}.</p>}
    </div>
  </div>);
}
