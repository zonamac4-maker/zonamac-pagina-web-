'use client';
import { useRef } from 'react';
import { IconChevron } from './Icons';
export default function ProductRow({ children }) {
  const r = useRef(null);
  const go = d => r.current.scrollBy({ left: d * r.current.clientWidth * 0.85, behavior: 'smooth' });
  return (<div className="rowwrap"><button className="arr l" aria-label="Anterior" onClick={() => go(-1)}><IconChevron dir="left" size={22} /></button><div className="prow" ref={r}>{children}</div><button className="arr r" aria-label="Siguiente" onClick={() => go(1)}><IconChevron size={22} /></button></div>);
}
