import SupportForm from '../../components/SupportForm';
import { WA } from '../../lib/data';
import { IconPhone, IconLaptop, IconWatch, IconHeadphones, IconPin } from '../../components/Icons';
export const metadata = { title: 'Soporte técnico para iPhone, iPad y Mac en Bogotá', description: 'Soporte técnico para tu iPhone, iPad, Mac, Apple Watch y AirPods en Bogotá. Cuéntanos qué le pasa a tu equipo y te respondemos por WhatsApp.', alternates: { canonical: '/soporte-tecnico' } };
const ITEMS = [[<IconPhone key="a" size={34} />, 'iPhone y iPad'], [<IconLaptop key="a" size={34} />, 'Mac'], [<IconWatch key="a" size={34} />, 'Apple Watch'], [<IconHeadphones key="a" size={34} />, 'AirPods']];
export default function Soporte() {
  return (<main className="catpage"><h1>Soporte técnico</h1>
    <p className="sub">¿Tu equipo Apple necesita ayuda? Cuéntanos qué le pasa y te respondemos por WhatsApp.</p>
    <div className="svc small4">{ITEMS.map(i => <div className="svcard" key={i[1]}><span className="ico">{i[0]}</span><h3>{i[1]}</h3></div>)}</div>
    <div className="sgrid"><div className="sbox"><h2>Cuéntanos tu caso</h2><SupportForm /></div>
      <div className="sbox"><h2>Atención directa</h2><p>Escríbenos o visítanos en nuestra tienda.</p><p><IconPin size={16} className="inl" /> Diagonal 182 # 20-91 Autopista Norte, Bogotá<br />Locales D161 y A226</p><p>WhatsApp: +57 3143574547</p>
        <a className="wabtn" href={WA + encodeURIComponent('Hola ZonaMac, necesito soporte técnico.')} target="_blank" rel="noopener">Escribir por WhatsApp</a></div></div></main>);
}
