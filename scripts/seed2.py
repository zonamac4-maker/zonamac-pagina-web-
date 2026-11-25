import json,sys,urllib.request,urllib.parse,html
U='https://ndgjorylkszupmphzmrk.supabase.co/rest/v1/';K='sb_publishable_Cl32y5NrOgDc65YR7vxsPg_haDKKHip'
H={'apikey':K,'Authorization':'Bearer '+K,'Content-Type':'application/json'}
def req(m,q,body=None,ret=False):
    h=dict(H); h['Prefer']='return=representation' if ret else 'return=minimal'
    r=urllib.request.Request(U+q,json.dumps(body).encode() if body is not None else None,h,method=m)
    try:
        with urllib.request.urlopen(r,timeout=60) as x: t=x.read(); return json.loads(t) if t else None
    except urllib.error.HTTPError as e: sys.exit(m+' '+q+' '+str(e.code)+' '+e.read().decode()[:300])
PH='/img/proximamente.svg'
def imgs_of(slug):
    r=req('GET','products?select=images&slug=eq.'+slug); return r[0]['images'] if r else [PH]
G1='1 año'
def split(cfgs):
    keys=[]; [keys.append(k) for c in cfgs for k in c['a'] if k not in keys]
    const={k for k in keys if len({c['a'].get(k) for c in cfgs})==1}
    specs={k:cfgs[0]['a'][k] for k in keys if k in const}
    vs=[{'attrs':{k:v for k,v in c['a'].items() if k not in const},'price':c['p'],'sale_price':c.get('s'),'stock':None,'active':True} for c in cfgs]
    return specs,vs
def c(a,p,s=None): return {'a':a,'p':p,'s':s if s and s<p else None}
PRODS=[]
def P(slug,name,cats,cond,cfgs,warranty=None,images=None,intro=None,note=None,order=100):
    specs,vs=split(cfgs)
    rows=''.join('<tr><th>%s</th><td>%s</td></tr>'%(html.escape(k),html.escape(v)) for k,v in specs.items())
    d=('<p>%s</p>'%html.escape(intro) if intro else '')+('<table class="spec">%s</table>'%rows if rows else '')+('<p>%s</p>'%html.escape(note) if note else '')
    sd='<p>%s</p>'%html.escape(intro) if intro else ''
    PRODS.append(dict(slug=slug,name=name,short_description=sd,description=d,images=images or [PH],category_slugs=cats,condition=cond,specs=specs,warranty=warranty,position=order+len(PRODS),_v=vs))
NEW='Nuevo y sellado. Garantía de 1 año.'
SS='Equipo semi nuevo. El estado de la batería se indica en cada unidad.'
IPH=['todos-los-iphone','iphone'];IPAD=['ipad'];MAC=['todos-los-mac'];WAT=['watch'];AIR=['airpods','accesorios'];ACC=['accesorios']
S='Almacenamiento';R='Memoria RAM'
# ---- NUEVOS
P('iphone-18-pro','iPhone 18 Pro',IPH,'nuevo',[c({S:'256 GB'},6000000,4650000),c({S:'512 GB'},6000000,5400000)],G1,intro=NEW)
P('iphone-18-pro-max','iPhone 18 Pro Max',IPH,'nuevo',[c({S:'256 GB'},6800000,5450000),c({S:'512 GB'},7250000,6050000)],G1,intro=NEW)
P('ipad-11-a16','iPad 11 A16',IPAD+['ipad-a16'],'nuevo',[c({'Chip':'A16',S:'128 GB'},1950000,1600000),c({'Chip':'A16',S:'256 GB'},2520000,2100000)],G1,intro=NEW)
P('ipad-air-m4-11','iPad Air Chip M4 11"',IPAD+['ipad-air'],'nuevo',[c({'Chip':'M4','Pantalla':'11"',S:'128 GB'},3750000,2800000),c({'Chip':'M4','Pantalla':'11"',S:'256 GB'},4350000,3250000)],G1,intro=NEW)
P('ipad-air-m4-13','iPad Air Chip M4 13"',IPAD+['ipad-air'],'nuevo',[c({'Chip':'M4','Pantalla':'13"',S:'128 GB'},3950000,3350000)],G1,intro=NEW)
P('ipad-pro-m5-13-256','iPad Pro Chip M5 13"',IPAD+['ipad-pro'],'nuevo',[c({'Chip':'M5','Pantalla':'13"',S:'256 GB'},6200000,5299000)],G1,images=imgs_of('ipad-pro-de-13-pulgadas-de-m5'),intro=NEW)
P('macbook-neo-13','MacBook Neo 13"',MAC,'nuevo',[c({'Pantalla':'13"',R:'8 GB',S:'256 GB SSD'},2950000,2750000),c({'Pantalla':'13"',R:'8 GB',S:'512 GB SSD'},4500000,3150000)],G1,intro=NEW)
P('macbook-air-m5','MacBook Air Chip M5',MAC+['macbook-air'],'nuevo',[c({'Chip':'M5',R:'16 GB',S:'512 GB SSD','Pantalla':'13"'},5500000,4850000),c({'Chip':'M5',R:'16 GB',S:'512 GB SSD','Pantalla':'15"'},7500000,5750000)],G1,intro=NEW)
P('macbook-pro-m5-14','MacBook Pro Chip M5 14"',MAC+['macbook-pro'],'nuevo',[c({'Chip':'M5','Pantalla':'14"',R:'16 GB',S:'512 GB SSD'},7400000,6850000),c({'Chip':'M5','Pantalla':'14"',R:'16 GB',S:'1 TB SSD'},8900000,7199000),c({'Chip':'M5','Pantalla':'14"',R:'24 GB',S:'1 TB SSD'},10400000,8200000)],G1,intro=NEW)
P('macbook-pro-m5-pro','MacBook Pro Chip M5 Pro',MAC+['macbook-pro'],'nuevo',[c({'Chip':'M5 Pro','Pantalla':'14"',R:'24 GB',S:'1 TB SSD'},13400000,9300000),c({'Chip':'M5 Pro','Pantalla':'16"',R:'24 GB',S:'1 TB SSD'},14300000,12800000),c({'Chip':'M5 Pro','Pantalla':'16"',R:'48 GB',S:'1 TB SSD'},19300000,15200000)],G1,intro=NEW)
P('mac-mini-m4','Mac mini Chip M4',MAC+['mac-mini'],'nuevo',[c({'Chip':'M4',R:'16 GB',S:'512 GB SSD'},3990000,3350000)],G1,intro=NEW)
P('mac-mini-m6','Mac mini Chip M6',MAC+['mac-mini'],'nuevo',[c({'Chip':'M6',R:'16 GB',S:'256 GB SSD'},4250000,3850000),c({'Chip':'M6',R:'16 GB',S:'512 GB SSD'},4850000),c({'Chip':'M6',R:'24 GB',S:'512 GB SSD'},7250000,5850000)],G1,intro=NEW)
P('airpods-5-sin-carga','AirPods 5ª Gen sin carga inalámbrica',AIR,'nuevo',[c({},850000,650000)],G1,intro=NEW)
P('airpods-5-con-carga','AirPods 5ª Gen con carga inalámbrica',AIR,'nuevo',[c({},950000,780000)],G1,intro=NEW)
P('apple-watch-se-3','Apple Watch SE 3ª Gen',WAT,'nuevo',[c({'Tamaño':'40 mm'},1600000,1250000),c({'Tamaño':'44 mm'},1950000,1390000)],G1,intro=NEW)
P('apple-watch-series-12','Apple Watch Serie 12',WAT,'nuevo',[c({'Tamaño':'42 mm'},2450000,1950000),c({'Tamaño':'46 mm'},2800000,2050000)],G1,intro=NEW)
P('apple-watch-ultra-4','Apple Watch Ultra 4',WAT,'nuevo',[c({},4400000,3650000)],G1,intro=NEW)
P('apple-pencil-usb-c','Apple Pencil USB-C',ACC,'nuevo',[c({},700000,500000)],G1,intro=NEW)
P('apple-pencil-pro','Apple Pencil Pro',ACC,'nuevo',[c({},700000,630000)],G1,intro=NEW)
P('pencil-pro-igoma','Pencil Pro iGoma',ACC,'nuevo',[c({},250000,130000)],G1,intro=NEW)
P('pencil-ultra-igoma','Pencil Ultra iGoma',ACC,'nuevo',[c({},300000,180000)],G1,intro=NEW)
P('magic-keyboard-ipad-air-m3-11','Magic Keyboard Original Apple para iPad Air M3 11"',ACC,'nuevo',[c({},1150000)],G1,intro=NEW)
P('magic-keyboard-2-espanol','Magic Keyboard 2 Español',ACC,'nuevo',[c({},400000)],None)
P('folio-a2039','Teclado Folio A2039',ACC,'nuevo',[c({},850000)],None)
P('google-pixel-11-pro','Google Pixel 11 Pro',['google-pixel'],'nuevo',[c({'Color':'Canyon',S:'256 GB'},4500000,3800000)],None,intro='Google Pixel nuevo.')
# ---- SEMI NUEVOS
def mb(slug,name,cats,cfgs,note=None,images=None): P(slug,name,cats+['semi-nuevos'],'semi-nuevo',cfgs,None,images=images,intro=SS,note=note)
def m(proc,cpu,gpu,ram,ssd,scr,col,bat,p,s,extra=None):
    a={'Procesador':proc,'Núcleos CPU':cpu,'Núcleos GPU':gpu,R:ram,S:ssd+' SSD','Pantalla':'Retina '+scr,'Color':col,'Batería':bat}
    if extra: a.update(extra)
    return c(a,p,s)
MB=MAC
mb('macbook-pro-m5-14-semi','MacBook Pro M5 14" (Semi nuevo)',MB+['macbook-pro'],[m('M5','10','10','16 GB','512 GB','14"','Black','40 ciclos · 99% (Condición Normal)',7500000,5800000)])
mb('macbook-air-m5-13-semi','MacBook Air M5 13" (Semi nuevo)',MB+['macbook-air'],[m('M5','10','8','16 GB','512 GB','13"','Midnight','3 ciclos · 100% (Condición Normal)',5200000,4300000)])
mb('macbook-air-m4-13-semi','MacBook Air M4 13" (Semi nuevo)',MB+['macbook-air'],[m('M4','10','8','16 GB','256 GB','13"','Midnight',b+' (Condición Normal)',4800000,3750000) for b in ['45 ciclos · 100%','67 ciclos · 100%','73 ciclos · 100%','146 ciclos · 99%']])
mb('macbook-pro-m3-pro-16-semi','MacBook Pro M3 Pro 16" (Semi nuevo)',MB+['macbook-pro'],[m('M3 Pro','12','18','36 GB','512 GB','16"','Black','318 ciclos · 88% (Condición Normal)',7800000,5600000)])
mb('macbook-pro-m3-pro-14-semi','MacBook Pro M3 Pro 14" (Semi nuevo)',MB+['macbook-pro'],[m('M3 Pro','11','14','18 GB','512 GB','14"','Black','250 ciclos · 93% (Condición Normal)',6500000,4900000),m('M3 Pro','11','14','18 GB','512 GB','14"','Black','44 ciclos · 100% (Condición Normal)',6500000,4800000)])
mb('macbook-pro-m3-14-semi','MacBook Pro M3 14" (Semi nuevo)',MB+['macbook-pro'],[m('M3','8','10','8 GB','512 GB','14"','Black','488 ciclos · 88% (Condición Normal)',4000000,3450000)])
mb('macbook-air-m3-13-semi','MacBook Air M3 13" (Semi nuevo)',MB+['macbook-air'],[m('M3','8','8','8 GB','256 GB','13"','Midnight','223 ciclos · 95% (Condición Normal)',3800000,3150000)])
mb('macbook-air-m2-13-semi','MacBook Air M2 13" (Semi nuevo)',MB+['macbook-air'],[m('M2','8','8','8 GB','256 GB','13"','Midnight','249 ciclos · 85% (Condición Normal)',3200000,2400000)])
mb('macbook-pro-m1-13-semi','MacBook Pro M1 13" (Semi nuevo)',MB+['macbook-pro'],[m('Chip M1','8','8','8 GB','512 GB','13"','Space Grey','241 ciclos · 85% (Condición Normal)',3500000,2450000),m('Chip M1','8','8','8 GB','512 GB','13"','Space Grey','425 ciclos · 85% (Condición Normal)',3500000,2400000),m('Chip M1','8','8','8 GB','256 GB','13"','Space Grey','136 ciclos · 90% (Condición Normal)',3500000,2250000),m('Chip M1','8','8','8 GB','256 GB','13"','Space Grey','641 ciclos · 90% (Condición Normal)',3500000,2200000)])
mb('macbook-pro-2019-15-semi','MacBook Pro 2019 15.4" (Semi nuevo)',MB+['macbook-pro'],[c({'Procesador':'Intel Core i7','Núcleos':'6',R:'16 GB',S:'512 GB SSD','Pantalla':'Retina 15.4"','Color':'Grey','Tarjeta de video':'4 GB · Intel UHD Graphics 630','Batería':'430 ciclos (Servicio recomendado)'},2950000,2300000)])
def ph(slug,name,cfgs,img=None): P(slug,name,IPH+['semi-nuevos'],'semi-nuevo',cfgs,None,images=imgs_of(img) if img else None,intro=SS)
def ip(s,b,col,p,sa,extra=None):
    a={S:s,'Batería':b,'Color':col}; return c(a,p,sa)
ph('iphone-17-pro-max-semi','iPhone 17 Pro Max (Semi nuevo)',[ip('512 GB','100%','Silver',5800000,4700000),ip('256 GB (SIM física)','93%','Silver',5800000,3750000)],'iphone-17-pro-max')
ph('iphone-16-pro-max-semi','iPhone 16 Pro Max (Semi nuevo)',[ip('256 GB','93% · 486 ciclos','Negro',4500000,3200000)],'iphone-16-pro-max-256gb')
ph('iphone-16-pro-semi','iPhone 16 Pro (Semi nuevo)',[ip('256 GB','97%','Titanio natural',4200000,3150000)],'iphone-16-pro-128gb')
ph('iphone-15-pro-semi','iPhone 15 Pro (Semi nuevo)',[ip('256 GB','85%','Negro',2900000,2550000),ip('128 GB','87%','Azul',2700000,2200000)])
ph('iphone-15-semi','iPhone 15 (Semi nuevo)',[ip('128 GB','85%','Verde pastel',2400000,1950000)])
ph('iphone-14-pro-max-semi','iPhone 14 Pro Max (Semi nuevo)',[ip('512 GB','82%','Negro',3100000,2200000)])
P('ipad-pro-m5-11-semi','iPad Pro M5 11" Wi-Fi (Semi nuevo)',IPAD+['ipad-pro','semi-nuevos'],'semi-nuevo',[c({'Chip':'M5','Pantalla':'11"',S:'256 GB','Color':'Silver','Conectividad':'Wi-Fi','Batería':'100% · 57 ciclos','Incluye':'Magic Keyboard'},6900000,4000000),c({'Chip':'M5','Pantalla':'11"',S:'256 GB','Color':'Silver','Conectividad':'Wi-Fi','Batería':'100% · 57 ciclos','Incluye':'Solo iPad'},5900000,3800000)],None,images=imgs_of('ipad-pro-de-11-pulgadas-de-m5'),intro=SS)
P('ipad-pro-m4-13-semi','iPad Pro M4 13" Wi-Fi + Cellular (Semi nuevo)',IPAD+['ipad-pro','semi-nuevos'],'semi-nuevo',[c({'Chip':'M4','Pantalla':'13"',S:'512 GB','Color':'Negro','Conectividad':'Wi-Fi + Cellular','Batería':'100% · 24 ciclos'},5900000,4800000)],None,intro=SS,note='Precio en efectivo: $4.300.000.')
P('ipad-air-m4-11-semi','iPad Air M4 11" Wi-Fi (Semi nuevo)',IPAD+['ipad-air','semi-nuevos'],'semi-nuevo',[c({'Chip':'M4','Pantalla':'11"',S:'256 GB','Color':'Morada','Conectividad':'Wi-Fi','Batería':'100% · 12 ciclos'},3850000,2600000)],None,intro=SS)
P('apple-watch-ultra-2-exhibicion','Apple Watch Ultra 2 49 mm (Exhibición)',WAT+['semi-nuevos'],'semi-nuevo',[c({'Tamaño':'49 mm','Estado':'Exhibición'},2700000,1800000)],None,intro='Apple Watch de exhibición.')
def px(slug,name,cfgs,intro): P(slug,name,['google-pixel','semi-nuevos'],'semi-nuevo',cfgs,None,intro=intro)
px('google-pixel-11-pro-caja-abierta','Google Pixel 11 Pro (Caja abierta)',[c({S:'512 GB','Color':'Olive','Estado':'Caja abierta'},4500000,4000000)],'Google Pixel en caja abierta.')
px('google-pixel-10-pro-xl-usado','Google Pixel 10 Pro XL (Usado)',[c({S:'128 GB','Batería':'100% · 238 ciclos','Color':'Negro'},3700000,2800000),c({S:'128 GB','Batería':'93% · 102 ciclos','Color':'Moonstone'},3700000,2800000)],'Google Pixel usado.')
px('google-pixel-10-pro-usado','Google Pixel 10 Pro (Usado)',[c({S:'128 GB','Batería':'100%','Color':'Negro'},3100000,2500000)],'Google Pixel usado.')
px('google-pixel-10-usado','Google Pixel 10 (Usado)',[c({S:'128 GB','Batería':'100%','Color':'Negro'},2800000,2300000)],'Google Pixel usado.')
px('google-pixel-9-pro-xl-usado','Google Pixel 9 Pro XL (Usado)',[c({S:'128 GB','Batería':'88%','Color':'Gris'},3100000,2500000)],'Google Pixel usado.')

# ---- categorias
cats=[{'slug':'google-pixel','name':'Google Pixel','position':6,'show_in_menu':True},{'slug':'macbook-pro','name':'MacBook Pro','position':99,'show_in_menu':False},{'slug':'mac-mini','name':'Mac mini','position':99,'show_in_menu':False}]
have={r['slug'] for r in req('GET','categories?select=slug')}
new=[x for x in cats if x['slug'] not in have]
if new: req('POST','categories',new)
req('PATCH','categories?slug=eq.semi-nuevos',{'position':7})
# ---- crear
hp={r['slug'] for r in req('GET','products?select=slug')}
for p in PRODS:
    if p['slug'] in hp: print('ya existe',p['slug']); continue
    vs=p.pop('_v'); pid=req('POST','products',[p],True)[0]['id']
    for v in vs: v['product_id']=pid
    req('POST','variants',vs); print('+',p['name'],len(vs))
# ---- actualizar existentes
def upd(slug,fn):
    r=req('GET','products?select=id,variants(id,attrs)&slug=eq.'+slug)[0]
    for v in r['variants']:
        b=fn(v['attrs'])
        if b is not None: req('PATCH','variants?id=eq.'+v['id'],b)
    print('~',slug)
upd('airpods-4a-gen-con-cancelacion-de-ruido',lambda a:{'price':870000,'sale_price':630000})
upd('airpods-pro3',lambda a:{'price':1580000,'sale_price':870000})
upd('apple-watch-series-11',lambda a:{'price':2200000,'sale_price':1590000} if a.get('Tamaño de la Caja')=='42 mm' else {'price':2400000,'sale_price':1690000})
upd('ipad-a16',lambda a:{'price':1950000,'sale_price':1600000} if a.get('Capacidad')=='128 GB' else {'price':2520000,'sale_price':2100000})
upd('ipad-pro-de-11-pulgadas-de-m5',lambda a:{'price':5300000,'sale_price':4499000})
r=req('GET','products?select=id,variants(attrs)&slug=eq.ipad-pro-de-13-pulgadas-de-m5')[0]
if not any(v['attrs'].get('Capacidad')=='256 GB' for v in r['variants']):
    req('POST','variants',[{'product_id':r['id'],'attrs':{'Color':col,'Capacidad':'256 GB'},'price':6200000,'sale_price':5299000,'stock':None,'active':True} for col in ('Negro espacial','Plata')]); print('+ 13" 256GB')
print('total',len(PRODS))
