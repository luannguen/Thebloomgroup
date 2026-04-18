import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Check for Cron Secret to ensure only Vercel can call this
  const authHeader = req.headers.get?.('authorization') || req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Perform a simple count to interact with the database
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Keep-alive query executed successfully',
      timestamp: new Date().toISOString(),
      count 
    });
  } catch (err: any) {
    console.error('Cron job error:', err);
    return res.status(500).json({ error: err.message });
  }
}
