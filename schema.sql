-- Estructura Oficial recomendada para la tabla 'restaurants' en Supabase (BulaFoodbot)

CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    username TEXT,
    alias TEXT,
    password TEXT,
    status TEXT DEFAULT 'Abierto',
    delivery_fee NUMERIC DEFAULT 3000,
    delivery_time TEXT DEFAULT '25-35 min',
    address TEXT,
    description TEXT,
    rating TEXT DEFAULT '5.0',
    reviews_count INT DEFAULT 1,
    cover_image TEXT,
    logo TEXT,
    tags JSONB DEFAULT '["Gastronomía Local"]'::jsonb,
    categories JSONB DEFAULT '["Popular", "Platos Fuertes", "Bebidas"]'::jsonb,
    menu JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existe con columna 'id uuid', asegurar que gen_random_uuid() esté como valor por defecto:
ALTER TABLE public.restaurants ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Opción alternativa: Si se desea permitir slugs personalizados de texto plano en lugar de UUIDs:
-- ALTER TABLE public.restaurants ALTER COLUMN id TYPE text USING id::text;

-- Desactivar RLS o permitir acceso libre de lectura e inserción anónima:
ALTER TABLE public.restaurants DISABLE ROW LEVEL SECURITY;
