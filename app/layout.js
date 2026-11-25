import './globals.css';
import Link from 'next/link';
import CartButton from '../components/CartButton';
import TopBar from '../components/TopBar';
import Newsletter from '../components/Newsletter';
import { Inter, Poppins } from 'next/font/google';
import { getMenu, WA, MAPS } from '../lib/data';
import { SITE, BRAND, PHONE, ADDRESS, SOCIAL, abs, JsonLd } from '../lib/seo';
import { IconSearch, IconWhatsApp, IconPin } from '../components/Icons';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--f-body' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], display: 'swap', variable: '--f-head' });
export const revalidate = 60;
const DESC = 'Compra iPhone, iPad, MacBook, Apple Watch y AirPods originales, nuevos y seminuevos con garantía en Bogotá. Envío a todo Colombia, entrega inmediata y asesoría por WhatsApp en ZonaMac, Autopista Norte.';
export const viewport = { themeColor: '#1d1d1f', width: 'device-width', initialScale: 1 };
export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'ZonaMac | iPhone, iPad y Mac originales en Bogotá', template: '%s | ZonaMac' },
  description: DESC,
  applicationName: BRAND,
  keywords: ['iPhone Bogotá', 'comprar iPhone Colombia', 'MacBook Bogotá', 'iPad Bogotá', 'Apple Watch Colombia', 'AirPods Colombia', 'iPhone seminuevo', 'tienda Apple Bogotá', 'ZonaMac'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_CO', siteName: BRAND, url: SITE, title: 'ZonaMac | Apple original en Bogotá', description: DESC, images: [{ url: '/img/logo.png', width: 928, height: 496, alt: 'ZonaMac' }] },
  twitter: { card: 'summary_large_image', title: 'ZonaMac | Apple original en Bogotá', description: DESC, images: ['/img/logo.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: '/img/favicon.png', apple: '/img/favicon.png' },
  formatDetection: { telephone: true, address: true },
};
const ORG = { '@context': 'https://schema.org', '@graph': [
  { '@type': ['Store', 'ElectronicsStore'], '@id': SITE + '/#store', name: 'ZonaMac', url: SITE, logo: abs('/img/logo.png'), image: abs('/img/logo.png'), telephone: PHONE, priceRange: '$$', address: ADDRESS, areaServed: 'CO', sameAs: SOCIAL, hasMap: 'https://maps.app.goo.gl/7W5qNLqkhDwe3a1H9', description: DESC, currenciesAccepted: 'COP', paymentAccepted: 'Efectivo, Transferencia, Tarjeta' },
  { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'ZonaMac', inLanguage: 'es-CO', publisher: { '@id': SITE + '/#store' }, potentialAction: { '@type': 'SearchAction', target: SITE + '/buscar?q={search_term_string}', 'query-input': 'required name=search_term_string' } },
] };
export default async function RootLayout({ children }) {
  const menu = await getMenu();
  return (<html lang="es-CO" className={inter.variable + ' ' + poppins.variable}><body>
    <JsonLd data={ORG} />
    <a className="skip" href="#contenido">Saltar al contenido</a>
    <TopBar />
    <header className="hdr"><Link href="/" className="brand" aria-label="ZonaMac, inicio"><img className="logo" src="/img/logo.png" alt="ZonaMac" width="100" height="54" /></Link>
      <form className="search" action="/buscar" role="search"><IconSearch size={20} /><input name="q" type="search" placeholder="Busca iPhone, MacBook, iPad, AirPods…" aria-label="Buscar productos" /></form>
      <div className="hright"><a className="hlink" href={WA} target="_blank" rel="noopener"><IconWhatsApp size={18} /> WhatsApp</a><CartButton /></div></header>
    <nav className="nav2" aria-label="Categorías"><div className="navin">{menu.map(c => <Link key={c.slug} href={'/categoria/' + c.slug} className={c.slug === 'semi-nuevos' ? 'green' : ''}>{c.name}</Link>)}
      <Link href="/ofertas" className="ofe">Ofertas</Link><i className="sep" />
      <Link href="/soporte-tecnico">Soporte técnico</Link><Link href="/#visitanos">Tiendas</Link><Link href="/categoria/bajo-pedido">Bajo pedido</Link></div></nav>
    <div id="contenido">{children}</div>
    <footer className="foot2"><div className="fcols">
      <div><h4>Productos</h4>{menu.map(c => <Link key={c.slug} href={'/categoria/' + c.slug}>{c.name}</Link>)}<Link href="/ofertas">Ofertas</Link></div>
      <div><h4>Servicios</h4><Link href="/soporte-tecnico">Soporte técnico</Link><a href={WA} target="_blank">Venta por WhatsApp</a><Link href="/#beneficios">Garantía y envíos</Link></div>
      <div><h4>ZonaMac</h4><Link href="/#visitanos">Encuentra tu tienda</Link><a href={MAPS} target="_blank" rel="noopener">Califícanos en Google</a><a href={WA} target="_blank">Contacto</a></div>
      <div><h4>Visítanos</h4><p><IconPin size={16} className="inl" /> Diagonal 182 # 20-91<br />Autopista Norte, Bogotá</p><p>Locales D161 y A226</p><p>WhatsApp: +57 3143574547</p>
        <div className="soc"><a href="https://www.instagram.com/zonamacco/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" width="44"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#fd5" /><stop offset=".5" stopColor="#ff543e" /><stop offset="1" stopColor="#c837ab" /></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#ig)" strokeWidth="2" /><circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#ig)" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.3" fill="#c837ab" /></svg></a>
      <a href={"https://www.tiktok.com/@zona.mac?is_from_webapp=1&sender_device=pc"} target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" width="40" height="44"><path fill="#25f4ee" transform="translate(-.9 .9)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/><path fill="#fe2c55" transform="translate(.9 -.9)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/><path fill="#000" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a><a href={WA} target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="44" fill="none" stroke="#25d366" strokeWidth="2"><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.5z" /><path d="M8.5 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" fill="#25d366" stroke="none" /></svg></a></div></div>
      <Newsletter /></div>
      <div className="copy">© 2026 ZonaMac · Apple original en Bogotá · Todos los derechos reservados</div></footer>
    <a className="wafloat" href={WA} target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp"><IconWhatsApp size={30} /></a>
  </body></html>);
}
