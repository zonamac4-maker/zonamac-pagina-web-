import json,re,sys,unicodedata,urllib.request
from PIL import Image,ImageChops
SRC='/tmp/claude-0/ap/st2/';OUT='/home/user/zonamac-app/public/img/'
U='https://ndgjorylkszupmphzmrk.supabase.co/rest/v1/';K='sb_publishable_Cl32y5NrOgDc65YR7vxsPg_haDKKHip'
H={'apikey':K,'Authorization':'Bearer '+K,'Content-Type':'application/json'}
def req(m,q,body=None):
    h=dict(H); h['Prefer']='return=representation'
    r=urllib.request.Request(U+q,json.dumps(body).encode() if body is not None else None,h,method=m)
    try:
        with urllib.request.urlopen(r,timeout=90) as x: t=x.read(); return json.loads(t) if t else None
    except urllib.error.HTTPError as e: sys.exit(m+' '+q+' '+str(e.code)+' '+e.read().decode()[:300])
def flat(im):
    im=im.convert('RGBA'); bg=Image.new('RGBA',im.size,(255,255,255,255)); bg.alpha_composite(im); return bg.convert('RGB')
def trim(im,thr=10):
    c=im.getpixel((2,2)); d=ImageChops.difference(im,Image.new('RGB',im.size,c)).convert('L').point(lambda v:255 if v>thr else 0); b=d.getbbox(); return im.crop(b) if b else im
def square(im,size=1000,margin=0.06):
    s=int(size*(1-2*margin))/max(im.size); im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS)
    c=Image.new('RGB',(size,size),(255,255,255)); c.paste(im,((size-im.width)//2,(size-im.height)//2)); return c
def make(key,kind='trim'):
    im=flat(Image.open(SRC+key+'.png'))
    if kind=='dark':   # tableta pequeña sobre fondo gris
        g=im.convert('L').point(lambda v:255 if v<110 else 0); b=g.getbbox(); im=im.crop((b[0]-12,b[1]-12,b[2]+12,b[3]+12))
    elif kind=='lefttile': im=im.crop((0,0,int(im.width*0.67),im.height)); im=trim(im,6)
    else: im=trim(im)
    f='ofi_s_%s.webp'%key; square(im).save(OUT+f,'WEBP',quality=88); return '/img/'+f
keys={}
import glob,os
for f in glob.glob(SRC+'*.png'):
    k=os.path.basename(f)[:-4]; keys[k]=make(k,'dark' if k.startswith('ipadpro11') else 'lefttile' if k=='mini_m6' else 'trim')
print(len(keys),'imagenes')
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn').strip()
M={
 'iphone-17-256-gb':{'azul neblina':['i17_mistblue'],'blanco':['i17_white'],'lavanda':['i17_lavender'],'negro':['i17_black'],'salvia':['i17_sage']},
 'iphone-17-pro':{'azul intenso':['i17pro_deepblue'],'cosmic orange':['i17pro_cosmicorange'],'plata':['i17pro_silver']},
 'iphone-17-pro-max':{'azul intenso':['i17pro_deepblue'],'cosmic orange':['i17pro_cosmicorange'],'plata':['i17pro_silver']},
 'iphone-air-256-gb':{'azul cielo':['iair_skyblue'],'cloud white':['iair_cloudwhite'],'light gold':['iair_lightgold'],'negro espacial':['iair_spaceblack']},
 'ipad-a16':{'amarillo':['ipad_yellow'],'azul':['ipad_blue'],'plata':['ipad_silver'],'rosa':['ipad_pink']},
 'ipad-11-a16':{'plata':['ipad_silver'],'azul':['ipad_blue'],'rosa':['ipad_pink']},
 'ipad-air-11-pulgadas-m3':{'azul':['ipadair11_blue'],'blanco estrella':['ipadair11_starlight'],'gris espacial':['ipadair11_spacegray'],'morado':['ipadair11_purple']},
 'ipad-air-11-pulgadas-m3-2':{'azul':['ipadair13_blue'],'blanco estrella':['ipadair13_starlight'],'gris espacial':['ipadair13_spacegray'],'morado':['ipadair13_purple']},
 'ipad-pro-de-11-pulgadas-de-m4':{'negro espacial':['ipadpro11_black'],'plata':['ipadpro11_silver']},
 'ipad-pro-de-11-pulgadas-de-m5':{'negro espacial':['ipadpro11_black'],'plata':['ipadpro11_silver']},
 'ipad-pro-de-13-pulgadas-de-m4-2':{'negro espacial':['ipadpro13_black'],'plata':['ipadpro13_silver']},
 'ipad-pro-de-13-pulgadas-de-m5':{'negro espacial':['ipadpro13_black'],'plata':['ipadpro13_silver']},
 'ipad-pro-m5-13-256':{'negro espacial':['ipadpro13_black'],'plata':['ipadpro13_silver']},
 'macbook-air-m4':{'azul cielo':['mba13_skyblue'],'azul medianoche':['mba13_midnight'],'blanco estrella':['mba13_starlight'],'plata':['mba13_silver']},
 'macbook-air-m4-de-15-pulgadas':{'azul cielo':['mba15_skyblue'],'azul medianoche':['mba15_midnight'],'blanco estrella':['mba15_starlight'],'plata':['mba15_silver']},
 'macbook-air-m5':{'azul cielo':['mba13_skyblue','mba15_skyblue'],'plata':['mba13_silver','mba15_silver'],'blanco estelar':['mba13_starlight','mba15_starlight'],'medianoche':['mba13_midnight','mba15_midnight']},
 'macbook-pro-m5-14':{'negro espacial':['mbp14_black'],'plata':['mbp14_silver']},
 'macbook-pro-m5-pro':{'negro espacial':['mbp14_black','mbp16_black'],'plata':['mbp14_silver','mbp16_silver']},
}
ONLY_IMG={'mac-mini-m6':['mini_m6'],'mac-mini-m4':['mini_m4'],'macbook-pro-m5-14-semi':['mbp14_black'],'macbook-air-m5-13-semi':['mba13_midnight'],'macbook-air-m4-13-semi':['mba13_midnight'],
 'macbook-air-m3-13-semi':['mba13_midnight'],'macbook-air-m2-13-semi':['mba13_midnight'],'macbook-pro-m3-14-semi':['mbp14_black'],'macbook-pro-m3-pro-14-semi':['mbp14_black'],'macbook-pro-m3-pro-16-semi':['mbp16_black'],'ipad-air-m4-11-semi':['ipadair11_blue']}
prods={p['slug']:p for p in req('GET','products?select=id,slug,images,colores')}
for slug,mp in M.items():
    p=prods[slug]; cols=[]
    for c in p['colores']:
        ks=mp.get(norm(c['nombre']))
        if ks: c=dict(c,imagenes=[keys[k] for k in ks])
        else: print('  sin foto',slug,c['nombre'])
        cols.append(c)
    first=next((c['imagenes'][0] for c in cols if c['imagenes']),None)
    body={'colores':cols}
    if first: body['images']=[first]+[i for i in p['images'] if i!=first and 'proximamente' not in i]
    req('PATCH','products?id=eq.'+p['id'],body); print('ok',slug)
for slug,ks in ONLY_IMG.items():
    p=prods.get(slug)
    if p: req('PATCH','products?id=eq.'+p['id'],{'images':[keys[k] for k in ks]}); print('img',slug)
