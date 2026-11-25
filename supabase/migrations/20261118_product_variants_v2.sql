-- ZonaMac: modelo v2 de productos (colores con galería, variantes color+almacenamiento, descripción larga y ficha técnica)

-- 1) Columnas nuevas ---------------------------------------------------------
alter table public.products rename column short_description to descripcion_corta;
alter table public.products rename column description to descripcion_larga;
alter table public.products
  add column especificaciones jsonb not null default '[]',          -- [{ "titulo": "Pantalla", "items": [{ "k": "Tipo", "v": "OLED" }] }]
  add column garantia_condiciones text,
  add column colores jsonb not null default '[]',                    -- [{ "nombre": "Titanio Natural", "hex": "#b9b2a6", "imagenes": ["/img/..."] }]
  add column etiqueta_almacenamiento text not null default 'Almacenamiento';  -- 'Tamaño de caja' en relojes

alter table public.variants
  add column color text,
  add column almacenamiento text,
  add column sku text,
  add column precio numeric(14,0),
  add column precio_anterior numeric(14,0);
create unique index variants_sku_key on public.variants (sku) where sku is not null;
create index variants_color_idx on public.variants (product_id, color);

-- 2) Conversión de datos de variantes ---------------------------------------
update public.variants set attrs = (attrs - 'Memoria') || jsonb_build_object('Memoria RAM', attrs->'Memoria') where attrs ? 'Memoria';
update public.variants set
  color = attrs->>'Color',
  almacenamiento = coalesce(attrs->>'Almacenamiento', attrs->>'Capacidad', attrs->>'Tamaño de la Caja', attrs->>'Tamaño'),
  precio = coalesce(sale_price, price),
  precio_anterior = case when sale_price is not null and sale_price < price then price end;
update public.variants set attrs = attrs - 'Color' - 'Almacenamiento' - 'Capacidad' - 'Tamaño de la Caja' - 'Tamaño';
alter table public.variants alter column precio set not null;
alter table public.variants add constraint variants_precio_check check (precio >= 0 and (precio_anterior is null or precio_anterior > precio));
alter table public.variants drop column price, drop column sale_price;
-- stock: null = disponible sin control de inventario; 0 = agotado
update public.variants set stock = 0 where not active and stock is null;

-- 3) Productos: etiquetas, textos, ficha técnica y colores --------------------
update public.products set etiqueta_almacenamiento = 'Tamaño de caja' where 'watch' = any(category_slugs);

update public.products set descripcion_corta = nullif(btrim(regexp_replace(regexp_replace(replace(descripcion_corta, '&nbsp;', ' '), '<[^>]+>', ' ', 'g'), '\s+', ' ', 'g')), '');
update public.products set descripcion_larga = nullif(btrim(regexp_replace(descripcion_larga, '<table class="spec">[\s\S]*?</table>', '', 'g')), '');
update public.products set descripcion_larga = null where descripcion_larga = '<p>' || descripcion_corta || '</p>';

update public.products set especificaciones = jsonb_build_array(jsonb_build_object('titulo', 'Ficha técnica',
  'items', (select jsonb_agg(jsonb_build_object('k', e.key, 'v', e.value) order by e.key) from jsonb_each_text(specs) e)))
  where specs <> '{}'::jsonb;
update public.products set garantia_condiciones = 'Producto nuevo y sellado con garantía de ' || warranty || '.' where warranty is not null;

create or replace function public.zm_hex(n text) returns text language sql immutable set search_path = '' as $$
  select case lower(btrim(n))
    when 'negro' then '#1d1d1f' when 'negro espacial' then '#2e2e30' when 'negro azabache' then '#232325' when 'negro brillante' then '#121214'
    when 'blanco' then '#f5f5f7' when 'blanco estrella' then '#f0ede6' when 'cloud white' then '#f2f2f2'
    when 'plata' then '#d9dadc' when 'silver' then '#d9dadc' when 'gris espacial' then '#6e6e73' when 'moonstone' then '#9fa3a8'
    when 'azul' then '#7aa2d6' when 'azul cielo' then '#a9c9e2' when 'azul medianoche' then '#2b3a55' when 'azul intenso' then '#1f4a8a'
    when 'azul neblina' then '#a7bcd0' when 'sierra blue' then '#a7c1d9' when 'ultramarino' then '#3f4fd0'
    when 'verde' then '#4f8a6b' when 'verde azulado' then '#3d8c8a' when 'salvia' then '#a8b8a0'
    when 'amarillo' then '#f4dd7a' when 'rosa' then '#f3c8d4' when 'oro rosa' then '#e6c1b0'
    when 'morado' then '#b9a5d8' when 'purpura' then '#8f78b8' when 'lavanda' then '#d7c7ee'
    when 'gold' then '#e3cfa6' when 'light gold' then '#e8d9b5' when 'cosmic orange' then '#e8672a' when 'rojo' then '#c8202f'
    when 'titanio natural' then '#b9b2a6' when 'natural' then '#b9b2a6' when 'titanio del desierto' then '#c2a98b'
    when 'titanio negro' then '#2b2b2d' when 'titanio blanco' then '#e4e1dc'
    else '#c8ccd2' end $$;

update public.products p set colores = coalesce((
  select jsonb_agg(jsonb_build_object('nombre', c, 'hex', public.zm_hex(c), 'imagenes', '[]'::jsonb) order by c)
  from (select distinct color c from public.variants v where v.product_id = p.id and v.color is not null) s), '[]'::jsonb);

alter table public.products drop column specs, drop column warranty;

-- 4) RLS: las variantes sin stock también son visibles (se muestran deshabilitadas) ----
drop policy if exists "public read active variants" on public.variants;
create policy "public read variants of active products" on public.variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.active));
