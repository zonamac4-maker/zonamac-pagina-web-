import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import ProductRow from '../components/ProductRow';
import HeroCarousel from '../components/HeroCarousel';
import { getProducts, getBanners, priceInfo, money, MAPS } from '../lib/data';
import { JsonLd } from '../lib/seo';
import { IconWrench, IconCheck, IconApple, IconChat, IconTruck, IconShield, IconWhatsApp, IconStore, IconPin, IconStar } from '../components/Icons';
export const revalidate = 60;
export const metadata = { title: { absolute: 'ZonaMac | iPhone, iPad y Mac originales en Bogotá - Nuevos y seminuevos' }, alternates: { canonical: '/' } };
const FAQ = [
  ['¿Los productos Apple de ZonaMac son originales?', 'Sí. Vendemos productos Apple originales, nuevos y seminuevos. Los seminuevos son equipos revisados y funcionales, listos para activar.'],
  ['¿Qué garantía tienen los equipos?', 'Los equipos nuevos tienen 1 año de garantía y los seminuevos 6 meses. Las condiciones de cada producto aparecen en su ficha.'],
  ['¿Hacen envíos a todo Colombia?', 'Sí. Enviamos a todo el país y hacemos entrega inmediata en Bogotá. También puedes retirar en nuestra tienda de Autopista Norte.'],
  ['¿Dónde está ubicada la tienda?', 'Estamos en Bogotá, Diagonal 182 # 20-91, Autopista Norte, locales D161 y A226.'],
  ['¿Cómo compro un producto?', 'Elige tu producto, color y capacidad, añádelo al carrito y finaliza el pedido por WhatsApp. Nuestro equipo te confirma disponibilidad y te acompaña en el proceso.'],
  ['¿Ofrecen soporte técnico?', 'Sí. Atendemos iPhone, iPad, Mac, Apple Watch y AirPods. Cuéntanos qué le pasa a tu equipo en la página de soporte técnico y te respondemos por WhatsApp.'],
];
const SECTIONS = [
  ['Lo último en iPhone', 'todos-los-iphone'], ['iPad para crear sin límites', 'ipad'], ['Mac para trabajar donde estés', 'todos-los-mac'],
  ['Apple Watch', 'watch'], ['AirPods y accesorios', 'accesorios'], ['Semi nuevos con garantía', 'semi-nuevos'],
];
const SERVICES = [
  [<IconWrench key="a" size={30} />, 'Soporte técnico', 'Diagnóstico y ayuda para tu iPhone, iPad, Mac y más. Cuéntanos qué le pasa a tu equipo.', '/soporte-tecnico', 'Solicitar soporte'],
  [<IconCheck key="a" size={30} />, 'Semi nuevos revisados', 'Equipos verificados y funcionales, con garantía de 6 meses y listos para activar.', '/categoria/semi-nuevos', 'Ver semi nuevos'],
  [<IconApple key="a" size={30} />, 'Apple original', 'Seleccionamos productos Apple originales, nuevos y seminuevos, con respaldo real.', '/categoria/todos-los-iphone', 'Ver catálogo'],
  [<IconChat key="a" size={30} />, 'Asesoría por WhatsApp', 'Te ayudamos a elegir el equipo ideal según tu uso y presupuesto.', 'https://api.whatsapp.com/send?phone=573143574547', 'Escribir ahora'],
];
const BEN = [[<IconTruck key="a" size={30} />, 'Envíos a todo el país', 'Entrega inmediata en Bogotá'], [<IconShield key="a" size={30} />, 'Garantía y respaldo', '1 año en nuevos · 6 meses en seminuevos'], [<IconWhatsApp key="a" size={30} />, 'Venta por WhatsApp', '+57 314 357 4547'], [<IconStore key="a" size={30} />, 'Retira en tienda', 'Autopista Norte, Bogotá']];
export default async function Home() {
  const [banners, ...rows] = await Promise.all([getBanners(), ...SECTIONS.map(s => getProducts({ category: s[1] }))]);
  const slides = banners.filter(b => b.product || b.link).map(b => {
    const i = b.product ? priceInfo(b.product) : null;
    const price = b.precio_texto || (i && !i.soldout && !i.quote ? (i.from ? 'Desde ' : '') + money(i.min) + ' COP' : null);
    return { id: b.id, eyebrow: b.eyebrow, headline: b.headline, subtitle: b.subtitle, cta: b.cta, theme: b.theme, image: b.product?.images?.[0], href: b.link || '/producto/' + b.product_slug, price,
      impact: b.theme === 'impact' && !!b.imagen, imagen: b.imagen, imagen2: b.imagen2, altoImagen: b.alto_imagen, priceWas: b.eyebrow === 'OFERTA' && i?.was ? money(i.was) : null, fondo: b.fondo, textoFondo: b.texto_fondo, chips: b.chips };
  });
  return (<main>
    {slides.length > 0 && <HeroCarousel slides={slides} />}
    <section className="intro2"><h1>iPhone, iPad y Mac originales en Bogotá</h1><p>Tienda Apple en Autopista Norte: equipos nuevos y seminuevos con precios competitivos, entrega inmediata, envío a todo Colombia y respaldo real. Aquí no compras por impulso; compras con criterio.</p></section>
    {SECTIONS.map((s, n) => { if (s[1] !== 'semi-nuevos') rows[n] = rows[n].filter(p => p.condition !== 'semi-nuevo'); return rows[n].length > 0 && (<section className="block" key={s[1]}><div className="bhead"><h2>{s[0]}</h2><Link href={'/categoria/' + s[1]}>Ver todo →</Link></div>
      <ProductRow>{rows[n].slice(0, 12).map(p => <ProductCard key={p.id} p={p} />)}</ProductRow></section>); })}
    <section className="block"><div className="bhead"><h2>Servicios de ZonaMac</h2></div>
      <div className="svc">{SERVICES.map(s => <Link key={s[1]} href={s[3]} className="svcard"><span className="ico">{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p><b>{s[4]} →</b></Link>)}</div></section>
    <section className="promo"><div><span className="eyebrow">OFERTAS</span><h2>Aprovecha los mejores precios</h2><p>Productos Apple con precio rebajado, mientras haya unidades.</p><Link className="hbtn" href="/ofertas">Ver ofertas</Link></div></section>
    <section className="block faq"><div className="bhead"><h2>Preguntas frecuentes</h2></div>
      <div className="faqs">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} /></section>
    <section id="beneficios" className="ben">{BEN.map(b => <div key={b[1]}><span>{b[0]}</span><b>{b[1]}</b><small>{b[2]}</small></div>)}</section>
    <section id="visitanos" className="visit"><h2>Encuentra tu tienda</h2><div className="vgrid"><div className="vinfo"><p><b>Zona Mac</b><br />Diagonal 182 # 20-91 Autopista Norte<br />Locales D161 y A226</p><p>WhatsApp: +57 3143574547</p>
      <div className="btns"><a className="wabtn" href={MAPS} target="_blank" rel="noopener"><IconPin size={16} /> Cómo llegar</a><a className="gbtn" href={MAPS} target="_blank" rel="noopener"><IconStar size={16} /> Califícanos en Google</a></div>
      <p className="small">¿Ya nos visitaste o compraste? Tu reseña nos ayuda a que más personas nos encuentren.</p></div>
      <iframe title="Ubicación Zona Mac" src="https://maps.google.com/maps?q=Diagonal+182+%2320-91+Autopista+Norte,+Bogot%C3%A1,+Colombia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></section>
  </main>);
}
