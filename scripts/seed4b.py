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
 'iphone-16':{'blanco':['i16_white'],'negro':['i16_black'],'rosa':['i16_pink'],'ultramarino':['i16_ultramarine'],'verde azulado':['i16_teal']},
 'iphone-14':{'amarillo':['i14_yellow'],'azul':['i14_blue'],'blanco':['i14_starlight'],'negro':['i14_midnight'],'purpura':['i14_purple']},
 'iphone-13-de-128-gb':{'azul':['i13_blue'],'azul medianoche':['i13_midnight'],'blanco':['i13_starlight'],'rojo':['i13_red'],'rosa':['i13_pink'],'verde':['i13_green']},
}
import os
prods={p['slug']:p for p in req('GET','products?select=id,slug,images,colores')}
for slug,mp in M.items():
    p=prods[slug]; cols=[]
    for c in p['colores']:
        ks=[k for k in mp.get(norm(c['nombre']),[]) if k in keys]
        if ks: c=dict(c,imagenes=[keys[k] for k in ks])
        else: print('  sin foto',slug,c['nombre'])
        cols.append(c)
    first=next((c['imagenes'][0] for c in cols if c['imagenes']),None)
    body={'colores':cols}
    if first: body['images']=[first]+[i for i in p['images'] if i!=first and 'proximamente' not in i][:0]
    req('PATCH','products?id=eq.'+p['id'],body); print('ok',slug)
