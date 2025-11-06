import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL exists
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn('[api/contact] Missing DATABASE_URL environment variable');
}

// Create a singleton sql tag (module scope reuse across invocations)
const sql = databaseUrl ? neon(databaseUrl) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!sql) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { fullName, email, phone, eventType, eventDate, guestCount, message } = req.body || {};

    if (!fullName || !email || !eventType || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const inserted = await sql`INSERT INTO contact_submissions (full_name, email, phone, event_type, event_date, guest_count, message)
      VALUES (${fullName}, ${email}, ${phone || null}, ${eventType}, ${eventDate ? new Date(eventDate) : null}, ${guestCount ?? null}, ${message})
      RETURNING id, created_at`;

    return res.status(201).json({ success: true, id: inserted[0].id });
  } catch (e) {
    console.error('[api/contact] Insert error', e);
    return res.status(500).json({ error: 'Server error' });
  }
}