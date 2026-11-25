export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://zonamac.com';
export const BRAND = 'ZonaMac';
export const PHONE = '+573143574547';
export const ADDRESS = { '@type': 'PostalAddress', streetAddress: 'Diagonal 182 # 20-91, Autopista Norte, Locales D161 y A226', addressLocality: 'Bogotá', addressRegion: 'Bogotá D.C.', addressCountry: 'CO' };
export const SOCIAL = ['https://www.instagram.com/zonamacco/', 'https://www.tiktok.com/@zona.mac'];
export const abs = u => !u ? undefined : /^https?:/.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u);
export const strip = (t, n = 160) => { const s = String(t || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
export const cleanText = t => String(t || '').replace(/^[\p{Extended_Pictographic}️\s]+/u, '').replace(/\s+([,.;:])/g, '$1');
export function JsonLd({ data }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />; }
export const CAT_SEO = {
  'todos-los-iphone': ['iPhone nuevos y seminuevos en Bogotá', 'Compra iPhone originales, nuevos y seminuevos con garantía en Bogotá. iPhone 18, 17, 16, 15, 14 y 13 con envío a toda Colombia y entrega inmediata en Autopista Norte.', 'Encuentra el iPhone ideal: modelos nuevos sellados y seminuevos revisados, con garantía, envío a toda Colombia y asesoría por WhatsApp.'],
  ipad: ['iPad nuevos y seminuevos en Bogotá', 'Compra iPad Pro, iPad Air y iPad originales con garantía en Bogotá. Envío a toda Colombia y asesoría por WhatsApp en ZonaMac.', 'iPad Pro M5, iPad Air y más: elige el tamaño y almacenamiento que necesitas para crear, estudiar o trabajar.'],
  'todos-los-mac': ['MacBook y Mac nuevos en Bogotá', 'Compra MacBook Air, MacBook Pro y Mac originales con garantía en Bogotá. Chips Apple M4 y M5, envío a todo el país y atención en Autopista Norte.', 'MacBook Air, MacBook Pro y más con chip Apple: potencia y batería para trabajar donde estés.'],
  watch: ['Apple Watch nuevos en Bogotá', 'Compra Apple Watch Ultra, Series y SE originales con garantía en Bogotá. Envío a toda Colombia y asesoría por WhatsApp en ZonaMac.', 'Apple Watch Ultra, Series y SE: salud, deporte y conectividad en tu muñeca.'],
  accesorios: ['AirPods y accesorios Apple en Bogotá', 'Compra AirPods, AirPods Pro, AirPods Max, Apple Pencil y accesorios Apple originales en Bogotá. Envío a todo el país con ZonaMac.', 'AirPods, Apple Pencil, teclados y accesorios originales para tu ecosistema Apple.'],
  'google-pixel': ['Google Pixel en Bogotá', 'Compra Google Pixel 10, Pixel 10 Pro y Pixel 9 Pro XL originales en Bogotá. Envío a toda Colombia y garantía con ZonaMac.', 'Google Pixel: la mejor cámara con IA de Android, disponible en ZonaMac.'],
  'semi-nuevos': ['Apple seminuevos con garantía en Bogotá', 'iPhone, iPad y Mac seminuevos revisados con garantía de 6 meses en Bogotá. Equipos verificados, listos para activar y con envío a todo el país.', 'Equipos Apple seminuevos verificados por nuestro equipo técnico, con garantía de 6 meses y listos para activar.'],
};
CAT_SEO.iphone = CAT_SEO['todos-los-iphone'];
CAT_SEO.airpods = ['AirPods originales en Bogotá', 'Compra AirPods 4, AirPods Pro 2 y AirPods Max originales con garantía en Bogotá. Envío a toda Colombia con ZonaMac.', 'AirPods originales: cancelación de ruido, audio espacial y la mejor integración con tu iPhone.'];
CAT_SEO['airpods-accesorios'] = CAT_SEO.airpods;
