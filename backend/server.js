require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

app.post('/monitor', async (req, res) => {
  const { url, email } = req.body;
  if (!url || !email) {
    return res.status(400).json({ error: 'URL and email are required' });
  }

  const { data, error } = await supabase
    .from('monitors')
    .insert({ url, email })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to create monitor' });
  }

  res.status(201).json({ message: 'Monitor added', monitor: data });
});

app.get('/monitors', async (req, res) => {
  const { data, error } = await supabase.from('monitors').select('*');
  if (error) {
    console.error('Supabase select error:', error);
    return res.status(500).json({ error: 'Failed to fetch monitors' });
  }
  res.json(data);
});

app.get('/', (req, res) => {
  res.json({"service":"PageWatch API", "status": "running"});
});

// Monitoring worker
setInterval(async () => {
  const { data: monitors, error: fetchError } = await supabase
    .from('monitors')
    .select('*');

  if (fetchError) {
    console.error('Error fetching monitors from Supabase:', fetchError);
    return;
  }

  for (const monitor of monitors) {
    try {
      const response = await fetch(monitor.url);
      const content = await response.text();
      const hash = crypto.createHash('md5').update(content).digest('hex');

      if (monitor.last_hash && monitor.last_hash !== hash) {
        console.log(`Page changed for ${monitor.url}`);
      }

      await supabase
        .from('monitors')
        .update({ last_hash: hash })
        .eq('id', monitor.id);
    } catch (error) {
      console.error(`Error fetching ${monitor.url}:`, error.message);
    }
  }
}, 10 * 60 * 1000); // 10 minutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});