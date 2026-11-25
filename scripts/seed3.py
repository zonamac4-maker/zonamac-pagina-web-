import json,re,sys,urllib.request,collections
U='https://ndgjorylkszupmphzmrk.supabase.co/rest/v1/';K='sb_publishable_Cl32y5NrOgDc65YR7vxsPg_haDKKHip'
H={'apikey':K,'Authorization':'Bearer '+K,'Content-Type':'application/json'}
DRY='--apply' not in sys.argv
def req(m,q,body=None,ret=False):
    h=dict(H); h['Prefer']='return=representation' if ret else 'return=minimal'
    r=urllib.request.Request(U+q,json.dumps(body).encode() if body is not None else None,h,method=m)
    try:
        with urllib.request.urlopen(r,timeout=90) as x: t=x.read(); return json.loads(t) if t else None
    except urllib.error.HTTPError as e: sys.exit(m+' '+q+' '+str(e.code)+' '+e.read().decode()[:300])
P=json.load(open('/tmp/claude-0/ap/specs/parsed.json'))
def blocks(page):
    if page not in ('macbook-air','macbook-pro'): return [P[page]['secs']]
    out=[];cur=None
    for s in P[page]['secs']:
        if 'section-finish' in s['id'] or cur is None:
            if 'section-finish' in s['id'] or not out: cur=[];out.append(cur)
        cur.append(s)
    return out
GROUPS=[('Diseño',('section-finish','section-size','section-splash','section-water','section-weight')),
 ('Pantalla',('section-display',)),('Chip y rendimiento',('section-chip',)),
 ('Cámara',('section-camera',)),('Batería',('section-battery','section-power')),
 ('Conectividad',('section-wireless','section-cellular','section-connectivity')),('Audio',('section-audio-tech','section-audio')),('Sensores',('section-sensors',))]
TITLES={'section-finish':'Acabados','section-capacity':'Capacidades'}
def pick(cols,idx):
    cols=[c for c in cols if c]
    if not cols: return []
    if len(cols)==1: return cols[0]
    if len(cols)==2: return cols[min(idx,1)]
    return cols[min(idx,len(cols)-1)]+(cols[-1] if len(cols)==3 and idx<2 else [])
def fmt(lines):
    out=[];n=0
    for l in lines:
        l=re.sub(r'\s+',' ',l).strip(' ;')
        if not l or l in out: continue
        if n+len(l)>300 and out: break
        out.append(l); n+=len(l)+3
    return ' · '.join(out)
def specs(page,block=0,idx=0,extra=None):
    secs=blocks(page)[block]; res=[]
    for g,keys in GROUPS:
        items=[]
        for s in secs:
            sid=s['id']
            if 'support' in sid or 'external' in sid or 'playback' in sid or 'calling' in sid or 'intelligence' in sid or 'hero' in sid: continue
            if any(sid==k or sid.startswith(k+'-') or (k in('section-display',) and sid.startswith(k)) for k in keys) or sid in keys:
                if k_match(sid,keys):
                    v=fmt(pick(s['cols'],idx))
                    t=TITLES.get(sid) or re.sub(r'\s*\d+$','',s['titulo']).strip()
                    if v and t: items.append({'k':t,'v':v})
        if items: res.append({'titulo':g,'items':items})
    if extra: res.append({'titulo':extra[0],'items':[{'k':k,'v':v} for k,v in extra[1]]})
    return res
def k_match(sid,keys): return any(sid==k or sid.startswith(k) for k in keys)
HEX={'Negro':'#1f2022','Plata':'#dfe0e2','Glaciar':'#9fb9d6','Borgoña':'#6b2d3a','Azul':'#7ba7d1','Morado':'#b19fd6','Blanco estelar':'#efe9df','Rosa':'#f1b9cb','Rosa rubor':'#f3c6cf','Amarillo cítrico':'#e6e07a','Índigo':'#4b5a8f','Azul cielo':'#a9c9e2','Medianoche':'#2d3340','Negro espacial':'#2f2f31','Gris espacial':'#6e6e73','Bronce oscuro':'#6a5440','Oro claro':'#e8d4a9'}
def colors(*items): return [{'nombre':n,'hex':HEX[n],'imagenes':[('/img/ofi_c_%s.webp'%f)] if f else []} for n,f in items]
G='Equipo nuevo y sellado, con garantía de 1 año en ZonaMac.'
D={}
D['iphone-18-pro']=dict(page=('iphone-18-pro',0,0),colors=colors(('Negro','i18_negro'),('Plata','i18_plata'),('Glaciar','i18_glaciar'),('Borgoña','i18_borgona')),
 desc="El iPhone 18 Pro combina un diseño unibody de aluminio, con frente y parte posterior de Ceramic Shield 2, y una pantalla Super Retina XDR OLED de 6,3 pulgadas con ProMotion de hasta 120 Hz, siempre activa y con Dynamic Island.\n\nCon el chip A20 Pro (CPU de 6 núcleos y GPU de 7 núcleos con Neural Accelerators) y resistencia IP68, está pensado para quienes quieren el máximo rendimiento todos los días.\n\nDisponible en Negro, Plata, Glaciar y Borgoña. "+G)
D['iphone-18-pro-max']=dict(page=('iphone-18-pro',0,1),colors=D['iphone-18-pro']['colors'],
 desc="El iPhone 18 Pro Max lleva el diseño Pro a la pantalla más grande: una Super Retina XDR OLED de 6,9 pulgadas con ProMotion de hasta 120 Hz, siempre activa y con Dynamic Island, dentro de un cuerpo unibody de aluminio con Ceramic Shield 2 al frente y atrás.\n\nEl chip A20 Pro (CPU de 6 núcleos y GPU de 7 núcleos con Neural Accelerators) y la resistencia IP68 lo hacen ideal para trabajar, jugar y crear sin pausas.\n\nDisponible en Negro, Plata, Glaciar y Borgoña. "+G)
D['ipad-11-a16']=dict(page=('ipad-11',0,0),colors=colors(('Plata',None),('Azul',None),('Rosa',None)),
 desc="El iPad de 11 pulgadas con chip A16 es la forma más sencilla de tener una tablet Apple para estudiar, trabajar, ver contenido y crear. Su pantalla Liquid Retina de 11 pulgadas, el chip A16 (CPU de 5 núcleos y GPU de 4 núcleos), Touch ID y Wi‑Fi 6 cubren el uso diario con fluidez, y la batería rinde hasta 10 horas.\n\nDisponible en Plata, Azul y Rosa. "+G)
D['ipad-air-m4-11']=dict(page=('ipad-air',0,0),colors=colors(('Azul','ipadair_azul'),('Morado','ipadair_morado'),('Blanco estelar','ipadair_blanco')),
 desc="El iPad Air de 11 pulgadas con chip M4 ofrece un rendimiento de nivel profesional en un diseño delgado de solo 6,1 mm. Su pantalla de 11 pulgadas con tecnología IPS y gama amplia de colores (P3), el chip M4 (CPU de 8 núcleos y GPU de 9 núcleos con trazado de rayos) y Wi‑Fi 7 lo hacen ideal para dibujar, editar y trabajar donde estés.\n\nDisponible en Azul, Morado y Blanco estelar. "+G)
D['ipad-air-m4-13']=dict(page=('ipad-air',0,1),colors=D['ipad-air-m4-11']['colors'],
 desc="El iPad Air de 13 pulgadas con chip M4 suma espacio de trabajo sin perder portabilidad: pantalla de 13 pulgadas con tecnología IPS y gama amplia de colores (P3), un grosor de solo 6,1 mm, chip M4 (CPU de 8 núcleos y GPU de 9 núcleos con trazado de rayos) y Wi‑Fi 7.\n\nDisponible en Azul, Morado y Blanco estelar. "+G)
D['ipad-pro-m5-13-256']=dict(page=('ipad-pro',0,1),colors=colors(('Plata',None),('Negro espacial',None)),
 desc="El iPad Pro de 13 pulgadas es la tablet más avanzada de Apple: pantalla OLED en tándem con ProMotion de 10 a 120 Hz, resolución de 2752 x 2064 a 264 ppi, chip con CPU de 9 núcleos y GPU de 10 núcleos con Neural Accelerators, y Wi‑Fi 7 con el chip inalámbrico N1.\n\nPensado para creativos y profesionales que necesitan potencia y una pantalla sin concesiones. Disponible en Plata y Negro espacial. "+G)
D['macbook-neo-13']=dict(page=('macbook-neo',0,0),colors=colors(('Plata','neo_plata'),('Rosa rubor','neo_rosa'),('Amarillo cítrico','neo_amarillo'),('Índigo','neo_indigo')),
 desc="La MacBook Neo es la portátil Apple más accesible y colorida: pantalla de 13 pulgadas con tecnología IPS y 500 nits, CPU de 6 núcleos, GPU de 5 núcleos, 8 GB de memoria unificada y hasta 16 horas de reproducción de video. Con 1,23 kg y solo 1,27 cm de grosor, va contigo a clase, al trabajo o a donde quieras.\n\nDisponible en Plata, Rosa rubor, Amarillo cítrico e Índigo. "+G)
D['macbook-air-m5']=dict(page=('macbook-air',0,0),colors=colors(('Azul cielo',None),('Plata',None),('Blanco estelar',None),('Medianoche',None)),
 extra=('Modelo de 15 pulgadas',[('Pantalla','15,3 pulgadas, 2880 x 1864 a 224 ppi, 500 nits'),('Batería','Hasta 18 horas de reproducción de video · Batería de 66,5 Wh'),('Audio','Sistema de sonido de seis parlantes')]),
 desc="La MacBook Air con chip M5 une ligereza y potencia: CPU de 10 núcleos (4 supernúcleos y 6 de eficiencia), GPU de 8 o 10 núcleos con Neural Accelerators, 16 GB de memoria unificada y hasta 18 horas de reproducción de video. Disponible en pantalla de 13,6 pulgadas o de 15,3 pulgadas, ambas con tecnología IPS y 500 nits, Wi‑Fi 7 y Bluetooth 6.\n\nColores: Azul cielo, Plata, Blanco estelar y Medianoche. "+G)
D['macbook-pro-m5-14']=dict(page=('macbook-pro',0,0),colors=colors(('Negro espacial',None),('Plata',None)),
 desc="La MacBook Pro de 14 pulgadas con chip M5 ofrece una pantalla Liquid Retina XDR de 14,2 pulgadas con brillo sostenido de 1.000 nits y pico de 1.600 nits en contenido HDR, CPU de 10 núcleos y GPU de 10 núcleos con Neural Accelerators. Con hasta 24 horas de reproducción de video, está hecha para trabajar sin conectarte a la corriente.\n\nDisponible en Negro espacial y Plata. "+G)
D['macbook-pro-m5-pro']=dict(page=('macbook-pro',0,1),colors=colors(('Negro espacial',None),('Plata',None)),
 extra=('Modelo de 16 pulgadas',[('Dimensiones','Grosor: 1,68 cm · Ancho: 35,57 cm · Profundidad: 24,81 cm'),('Peso','2,14 kg (chip M5 Pro)')]),
 desc="La MacBook Pro con chip M5 Pro está pensada para flujos de trabajo exigentes: CPU de hasta 15 o 18 núcleos, GPU de 16 o 20 núcleos con Neural Accelerators, ancho de banda de memoria de hasta 307 GB/s y pantalla Liquid Retina XDR de 14 o 16 pulgadas. Rendimiento sostenido para edición de video, desarrollo, diseño y modelos de IA.\n\nDisponible en Negro espacial y Plata. "+G)
D['mac-mini-m6']=dict(page=('mac-mini',0,0),colors=None,
 desc="El Mac mini con chip M6 es un equipo de escritorio compacto (5 cm de alto y 12,7 cm de lado) con CPU de 12 núcleos (2 supernúcleos, 4 de rendimiento y 6 de eficiencia) y GPU de 12 núcleos con Neural Accelerators. Admite hasta tres monitores, incluye Ethernet de 2,5 Gb y dos puertos USB‑C, y pesa solo 0,67 kg.\n\nIdeal para oficina, estudio o como centro de trabajo creativo. "+G)
D['airpods-5-sin-carga']=dict(page=('airpods-5',0,0),colors=None,desc="Los AirPods 5ª generación incorporan el chip H2, un controlador de alta excursión diseñado por Apple, un amplificador exclusivo con alto rango dinámico y Cancelación Activa de Ruido, con conexión Bluetooth 5.3. Este modelo es la versión sin carga inalámbrica. "+G)
D['airpods-5-con-carga']=dict(page=('airpods-5',0,1),colors=None,desc="Los AirPods 5ª generación incorporan el chip H2, un controlador de alta excursión diseñado por Apple, un amplificador exclusivo con alto rango dinámico y Cancelación Activa de Ruido, con conexión Bluetooth 5.3. Este modelo incluye estuche con carga inalámbrica. "+G)
D['apple-watch-se-3']=dict(page=('apple-watch-se-3',0,1),colors=colors(('Medianoche','se3_medianoche'),('Blanco estelar','se3_blanco')),
 desc="El Apple Watch SE 3 reúne lo esencial de Apple Watch a un gran precio: chip S10 con procesador de doble núcleo, pantalla Retina OLED siempre activa con vidrio frontal Ion‑X, hasta 18 horas de uso normal y hasta 32 horas en modo Ahorrar Batería. Disponible en cajas de 40 mm y 44 mm.\n\nColores: Medianoche y Blanco estelar. "+G)
D['apple-watch-series-12']=dict(page=('apple-watch-series-12',0,1),colors=colors(('Negro','s12_negro'),('Gris espacial','s12_gris'),('Bronce oscuro','s12_bronce'),('Oro claro','s12_oro')),
 desc="El Apple Watch Series 12 tiene chip S11 con procesador de doble núcleo, pantalla Retina OLED LTPO3 siempre activa, hasta 24 horas de uso normal y hasta 38 horas con el modo Ahorrar Batería. Disponible en cajas de aluminio de 42 mm y 46 mm.\n\nColores: Negro, Gris espacial, Bronce oscuro y Oro claro. "+G)
# existentes: solo ficha técnica oficial
SPEC_ONLY={'iphone-17-256-gb':('iphone-17',0,0),'iphone-air-256-gb':('iphone-air',0,0),'iphone-16':('iphone-16',0,0),'airpods-pro3':('airpods-pro',0,0),'ipad-a16':('ipad-11',0,0),
 'ipad-pro-de-11-pulgadas-de-m5':('ipad-pro',0,0),'ipad-pro-de-13-pulgadas-de-m5':('ipad-pro',0,1)}
def spec_of(t): return specs(*t) if len(t)==3 else specs(t[0])
prods={p['slug']:p for p in req('GET','products?select=id,slug,name,images,colores,descripcion_larga,especificaciones,condition,variants(*)')}
if DRY:
    print(json.dumps(specs('iphone-18-pro',0,0),ensure_ascii=False,indent=1)[:2600])
    print({k:len(spec_of(v['page'])) for k,v in D.items()})
    sys.exit()
def mkvar(v,color):
    d={k:v[k] for k in ('almacenamiento','precio','precio_anterior','stock','active','attrs')}; d['color']=color; d['product_id']=v['product_id']; return d
for slug,d in D.items():
    p=prods.get(slug)
    if not p: print('NO EXISTE',slug); continue
    off=spec_of(d['page']) if 'extra' not in d else specs(d['page'][0],d['page'][1],d['page'][2],d['extra'])
    cfg=[dict(s,titulo='Configuración') for s in (p['especificaciones'] or []) if s['titulo'] in ('Ficha técnica','Configuración')]
    body={'descripcion_larga':d['desc'],'especificaciones':cfg+off}
    if d['colors']:
        body['colores']=d['colors']
        base={}
        for v in p['variants']: base.setdefault((v['almacenamiento'],json.dumps(v['attrs'],sort_keys=True)),v)
        if not any(v['color'] for v in p['variants']):
            new=[mkvar(v,c['nombre']) for c in d['colors'] for v in base.values()]
            req('DELETE','variants?product_id=eq.'+p['id']); req('POST','variants',new)
    req('PATCH','products?id=eq.'+p['id'],body); print('ok',slug)
for slug,t in SPEC_ONLY.items():
    p=prods.get(slug)
    if p: req('PATCH','products?id=eq.'+p['id'],{'especificaciones':spec_of(t)}); print('ficha',slug)
# descripcion para semi nuevos (a partir de los datos del propio equipo)
for slug,p in prods.items():
    if p['condition']!='semi-nuevo' or p.get('descripcion_larga'): continue
    items={i['k']:i['v'] for s in (p['especificaciones'] or []) for i in s['items']}
    n=p['name']; ph=re.sub(r'\s*\(.*?\)','',n)
    if slug.startswith('google-pixel'):
        est='caja abierta' if 'caja-abierta' in slug else 'usado'
        t=f"{ph} en estado {est}. Cada unidad indica su porcentaje de batería para que sepas exactamente qué estás comprando. Escríbenos por WhatsApp y te enviamos fotos reales del equipo."
    elif 'exhibicion' in slug: t=f"{ph} de exhibición, con precio especial. Escríbenos por WhatsApp para ver fotos del equipo."
    else:
        bits=[b for b in (items.get('Procesador'),items.get('Memoria RAM'),items.get('Almacenamiento'),items.get('Pantalla')) if b]
        t=f"{ph} semi nuevo"+(' con '+', '.join(bits) if bits else '')+". Cada unidad indica el estado real de su batería, para que compres con total transparencia. Escríbenos por WhatsApp y te enviamos fotos reales del equipo."
    req('PATCH','products?id=eq.'+p['id'],{'descripcion_larga':t}); print('semi',slug)
# SKU para todas las variantes sin SKU
allv=req('GET','variants?select=id,product_id,color,almacenamiento,sku&order=id')
slugof={p['id']:p['slug'] for p in prods.values()}
def code(s): return re.sub(r'[^A-Z0-9]','',(s or '').upper().replace('Ñ','N').replace('Í','I').replace('Á','A').replace('É','E').replace('Ó','O').replace('Ú','U'))
used={v['sku'] for v in allv if v['sku']}
for v in allv:
    if v['sku']: continue
    base='ZM-'+code(slugof.get(v['product_id'],'X'))[:16]+('-'+code(v['almacenamiento'])[:8] if v['almacenamiento'] else '')+('-'+code(v['color'])[:4] if v['color'] else '')
    s=base;n=2
    while s in used: s=base+'-'+str(n);n+=1
    used.add(s); req('PATCH','variants?id=eq.'+v['id'],{'sku':s})
print('skus listos')
