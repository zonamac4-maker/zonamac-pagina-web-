'use client';
import { useEffect, useState } from 'react';
import { readCart, writeCart } from './CartButton';
import { WA, money } from '../lib/data';
export default function Cart() {
  const [c, setC] = useState(null);
  useEffect(() => setC(readCart()), []);
  if (!c) return null;
  if (!c.length) return <p>Tu carrito está vacío.</p>;
  const t = c.reduce((s, i) => s + i.price * i.qty, 0);
  const del = x => { const n = c.filter((_, j) => j !== x); writeCart(n); setC(n); };
  const msg = 'Hola ZonaMac, quiero pedir:\n' + c.map(i => `- ${i.qty}x ${i.name} (${i.opts}) ${money(i.price * i.qty)}`).join('\n') + '\nTotal: ' + money(t);
  return (<div id="cart"><table><thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th></th></tr></thead><tbody>
    {c.map((i, x) => <tr key={i.k}><td>{i.name}<br /><small>{i.opts}</small></td><td>{i.qty}</td><td>{money(i.price * i.qty)}</td><td><button onClick={() => del(x)}>Quitar</button></td></tr>)}
  </tbody></table><p><b>Total: {money(t)}</b></p><a className="cbtn" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener">Finalizar pedido por WhatsApp</a></div>);
}
