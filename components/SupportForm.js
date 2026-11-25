'use client';
import { useState } from 'react';
import { WA } from '../lib/data';
export default function SupportForm() {
  const [v, setV] = useState({ name: '', device: 'iPhone', model: '', issue: '' });
  const set = k => e => setV({ ...v, [k]: e.target.value });
  const send = e => { e.preventDefault(); const m = `Hola ZonaMac, necesito soporte técnico.\nNombre: ${v.name}\nEquipo: ${v.device} ${v.model}\nProblema: ${v.issue}`; window.open(WA + encodeURIComponent(m), '_blank'); };
  return (<form className="sform" onSubmit={send}>
    <label>Nombre<input required value={v.name} onChange={set('name')} /></label>
    <div className="two"><label>Equipo<select value={v.device} onChange={set('device')}>{['iPhone', 'iPad', 'Mac', 'Apple Watch', 'AirPods', 'Otro'].map(o => <option key={o}>{o}</option>)}</select></label>
    <label>Modelo (opcional)<input value={v.model} onChange={set('model')} placeholder="Ej. iPhone 13 Pro" /></label></div>
    <label>¿Qué le pasa a tu equipo?<textarea required rows={4} value={v.issue} onChange={set('issue')} /></label>
    <button className="cbtn" type="submit">Enviar por WhatsApp</button></form>);
}
