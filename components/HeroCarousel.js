'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconChevron } from './Icons';
export default function HeroCarousel({ slides }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const n = slides.length;
  useEffect(() => { if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const t = setInterval(() => setI(x => (x + 1) % n), 6500); return () => clearInterval(t); }, [n, i, hold]);
  const go = d => setI(x => (x + d + n) % n);
  const Cta = ({ s }) => /^https?:/.test(s.href) ? <a className="hbtn" href={s.href} target="_blank" rel="noopener">{s.cta}</a> : <Link className="hbtn" href={s.href}>{s.cta}</Link>;
  return (<section className="hero2" aria-roledescription="carrusel" aria-label="Destacados" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}><div className="hslides" style={{ transform: `translateX(-${i * 100}%)` }}>
    {slides.map((s, k) => s.impact ? (
      <div key={s.id} className="hslide th-impact" style={{ background: s.fondo }} aria-hidden={k !== i} inert={k !== i}>
        {s.textoFondo && <span className="bgword" aria-hidden="true">{s.textoFondo}</span>}
        <div className="htext">
          {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
          <h2>{s.headline}</h2><p className="hsub">{s.subtitle}</p>
          {s.chips?.length > 0 && <ul className="chips2">{s.chips.map(c => <li key={c}>{c}</li>)}</ul>}
          {s.price && <p className="hprice">{s.priceWas && <del>{s.priceWas}</del>}{s.price}</p>}
          <Cta s={s} />
        </div>
        <div className="himgwrap" style={s.altoImagen ? { '--ih': s.altoImagen } : undefined}>{s.imagen2 && <img className="himg himg-back" src={s.imagen2} alt="" loading="lazy" decoding="async" />}<img className="himg" src={s.imagen} alt={s.headline} width="900" height="900" loading={k === 0 ? 'eager' : 'lazy'} fetchPriority={k === 0 ? 'high' : 'auto'} decoding="async" /></div>
      </div>
    ) : (
      <div key={s.id} className={'hslide th-' + s.theme} aria-hidden={k !== i} inert={k !== i}>
        <div className="htext">{s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}<h2>{s.headline}</h2><p>{s.subtitle}</p>{s.price && <p className="hprice">{s.price}</p>}<Cta s={s} /></div>
        {s.image && <img src={s.image} alt={s.headline} width="600" height="600" loading="lazy" decoding="async" />}
      </div>
    ))}</div>
    <button className="harr l" aria-label="Anterior" onClick={() => go(-1)}><IconChevron dir="left" size={24} /></button><button className="harr r" aria-label="Siguiente" onClick={() => go(1)}><IconChevron size={24} /></button>
    <div className="dots">{slides.map((s, k) => <button key={s.id} aria-label={'Banner ' + (k + 1)} aria-current={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div></section>);
}
