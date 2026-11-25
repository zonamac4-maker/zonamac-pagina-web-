'use client';
import { useState } from 'react';
import { sb } from '../lib/data';
export default function Newsletter() {
  const [st, setSt] = useState('');
  async function submit(e) {
    e.preventDefault(); const f = new FormData(e.target); setSt('...');
    const { error } = await sb.from('subscribers').insert({ email: f.get('email'), name: f.get('name') || null, phone: f.get('phone') || null });
    if (error) setSt('No pudimos guardar tu correo. Intenta de nuevo.'); else { setSt('¡Listo! Te avisaremos de nuestras ofertas.'); e.target.reset(); }
  }
  return (<form className="news" onSubmit={submit}><h3>Entérate primero de nuestras ofertas</h3>
    <input name="email" type="email" placeholder="Correo electrónico" required /><div className="two"><input name="name" placeholder="Nombre" /><input name="phone" placeholder="Celular" /></div>
    <button>Suscribirme</button>{st && <p className="small">{st}</p>}</form>);
}
