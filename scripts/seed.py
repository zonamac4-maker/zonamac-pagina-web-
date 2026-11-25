import csv,json,re,sys,urllib.request,os
R='/home/user/zonamac-original'
URL='https://ndgjorylkszupmphzmrk.supabase.co/rest/v1/'
KEY='sb_publishable_Cl32y5NrOgDc65YR7vxsPg_haDKKHip'
def call(t,rows,ret=False):
    req=urllib.request.Request(URL+t,json.dumps(rows).encode(),{'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json','Prefer':'return=representation' if ret else 'return=minimal'})
    try:
        with urllib.request.urlopen(req,timeout=60) as r: return json.loads(r.read() or 'null')
    except urllib.error.HTTPError as e: sys.exit(t+' '+str(e.code)+' '+e.read().decode()[:400])
def have(t,col):
    req=urllib.request.Request(URL+t+'?select='+col,headers={'apikey':KEY,'Authorization':'Bearer '+KEY})
    return {r[col] for r in json.loads(urllib.request.urlopen(req,timeout=60).read())}
def n(v):
    try: return float(v)
    except: return None
def clean(t): return re.sub(r' data-(start|end)="\d+"','',t or '')
def img(u): return '/img/'+u.split('/uploads/')[1].replace('/','_')
prods=json.load(open(R+'/data/products.json'))
exp=list(csv.DictReader(open(R+'/data/wc-export.csv',encoding='utf-8-sig')))
sku={x['SKU']:x['ID'] for x in exp if x['Tipo']!='variation' and x['SKU']}
simple={x['ID']:x for x in exp if x['Tipo']=='simple'}
vars_={}
for x in exp:
    if x['Tipo']!='variation': continue
    s=x['Superior']; pid=s[3:] if s.startswith('id:') else sku.get(s)
    reg=n(x['Precio normal'])
    if reg is None: continue
    a={x['Nombre del atributo %d'%i]:x['Valor(es) del atributo %d'%i].strip() for i in (1,2,3) if x['Nombre del atributo %d'%i]}
    vars_.setdefault(pid,[]).append({'attrs':a,'price':int(reg),'sale_price':int(n(x['Precio rebajado'])) if n(x['Precio rebajado']) else None,'stock':int(n(x['Inventario'])) if n(x['Inventario']) is not None else None,'active':x['Inventario'].strip()!='0'})
cats=json.load(open(R+'/data/categories.json'))
menu={'todos-los-mac':'Mac','ipad':'iPad','iphone':'iPhone','watch':'Watch','airpods':'Airpods','accesorios':'Accesorios','semi-nuevos':'Semi Nuevos'}
order=list(menu)
crow=[]
for c in cats:
    crow.append({'slug':c['slug'],'name':menu.get(c['slug'],c['name']),'position':order.index(c['slug']) if c['slug'] in menu else 99,'show_in_menu':c['slug'] in menu})
hc=have('categories','slug'); crow=[c for c in crow if c['slug'] not in hc]
if crow: call('categories',crow)
print('categorias',len(crow))
hp=have('products','slug')
for i,p in enumerate(prods):
    if p['slug'] in hp: continue
    sl=[c['slug'] for c in p['categories']]
    row={'slug':p['slug'],'name':p['name'],'short_description':clean(p['short_description']),'description':clean(p['description']),
         'images':[img(x['src']) for x in p['images']],'category_slugs':sl,'condition':'semi-nuevo' if 'semi-nuevos' in sl else 'nuevo',
         'featured':p['slug'] in('iphone-14','iphone-13-pro-max','iphone-13-pro'),'position':i,'active':True}
    pid=call('products',[row],True)[0]['id']
    v=vars_.get(str(p['id']))
    if not v and str(p['id']) in simple:
        x=simple[str(p['id'])]; v=[{'attrs':{},'price':int(n(x['Precio normal'])),'sale_price':int(n(x['Precio rebajado'])) if n(x['Precio rebajado']) else None,'stock':None,'active':True}]
    for r in v or []: r['product_id']=pid
    if v: call('variants',v)
    print(p['name'],len(v or []))
