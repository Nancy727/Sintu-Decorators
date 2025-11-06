import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
console.log(databaseUrl);
const sql = databaseUrl ? neon(databaseUrl) : null;

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  if (!sql)
    return res.status(500).json({ status: "error", reason: "No DB URL" });
  try {
    await sql`SELECT 1`;
    return res.json({ status: "ok" });
  } catch (e) {
    console.error("[api/health] error", e);
    return res.status(500).json({ status: "error" });
  }
}
