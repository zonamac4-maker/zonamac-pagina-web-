'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const MSG = [
  ['Productos Apple originales, nuevos y seminuevos con garantía.', 'Ver ofertas', '/ofertas'],
  ['Visítanos en Autopista Norte, Diagonal 182 # 20-91.', 'Cómo llegar', '/#visitanos'],
  ['¿Tu equipo necesita ayuda? Soporte técnico en ZonaMac.', 'Soporte técnico', '/soporte-tecnico'],
];
export default function TopBar() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % MSG.length), 5000); return () => clearInterval(t); }, []);
  const go = d => setI(x => (x + d + MSG.length) % MSG.length);
  return (<div className="topbar"><button aria-label="Mensaje anterior" onClick={() => go(-1)}>‹</button><span aria-live="polite">{MSG[i][0]} <Link href={MSG[i][2]}>{MSG[i][1]}</Link></span><button aria-label="Mensaje siguiente" onClick={() => go(1)}>›</button></div>);
}
