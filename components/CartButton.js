'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconCart } from './Icons';
export function readCart() { try { return JSON.parse(localStorage.getItem('zm_cart') || '[]'); } catch { return []; } }
export function writeCart(c) { try { localStorage.setItem('zm_cart', JSON.stringify(c)); window.dispatchEvent(new Event('zm-cart')); } catch {} }
export default function CartButton() {
  const [c, setC] = useState([]);
  useEffect(() => { const f = () => setC(readCart()); f(); window.addEventListener('zm-cart', f); return () => window.removeEventListener('zm-cart', f); }, []);
  const t = c.reduce((s, i) => s + i.price * i.qty, 0), q = c.reduce((s, i) => s + i.qty, 0);
  return <Link className="cartbtn" href="/carrito" aria-label={`Carrito, ${q} productos`}><IconCart size={20} />{q ? <span className="cnt">{q}</span> : null}<span className="ctot">{t ? '$' + t.toLocaleString('en-US') : 'Carrito'}</span></Link>;
}
