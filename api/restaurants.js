// Serverless Function de Vercel (/api/restaurants)
// Ejecuta consultas y escrituras del lado del servidor (Node.js) evitando restricciones RLS y bloqueos del navegador.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vxvyiklzyfmfbrgwqgxv.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_mnfzndBWIgcp3yGRUMh9ng_xOrDNrPn';

module.exports = async (req, res) => {
  // Manejo de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const headers = {
    'apikey': SUPABASE_SECRET_KEY,
    'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': req.method === 'POST' ? 'return=representation' : 'count=exact'
  };

  try {
    // 1. Obtener restaurantes (GET)
    if (req.method === 'GET') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=*`, {
        method: 'GET',
        headers
      });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      } else {
        const text = await response.text();
        return res.status(response.status).json({ error: text });
      }
    }

    // 2. Insertar nueva vitrina / restaurante (POST)
    if (req.method === 'POST') {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/restaurants`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      } else {
        const text = await response.text();
        return res.status(response.status).json({ error: text });
      }
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error("Excepción en /api/restaurants:", err);
    res.status(500).json({ error: err.message });
  }
};
