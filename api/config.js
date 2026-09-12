// Endpoint de configuración para Vercel (servido en /api/config)
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    supabaseUrl: 'https://vxvyiklzyfmfbrgwqgxv.supabase.co',
    supabaseAnonKey: 'sb_publishable_mnfzndBWigcp3yGRUMH9ng_x0rDN...'
  });


};
