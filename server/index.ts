import { performance } from "node:perf_hooks";
import nodemailer from "nodemailer";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import cors from "cors";
import {
  apiLimiter,
  contactSecurityMiddleware,
  adminSecurityMiddleware,
  authenticateAdmin,
  securityHeaders,
  errorHandler,
  sqlInjectionProtection,
} from "./middleware/security";

dotenv.config();

const app = express();

// Apply global security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));

// Apply SQL injection protection globally
app.use(sqlInjectionProtection);

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

const isDev = process.env.NODE_ENV !== "production";

// Validate DATABASE_URL early to avoid cryptic SASL errors
const connectionString = process.env.DATABASE_URL;
if (
  !connectionString ||
  typeof connectionString !== "string" ||
  !connectionString.startsWith("postgres")
) {
  console.error(
    "\n[Startup Error] DATABASE_URL is missing or invalid. Create a .env file with a valid Neon connection string."
  );
  // Provide a quick hint
  console.error(
    "Example: DATABASE_URL=postgresql://USER:PASSWORD@HOST/dbname?sslmode=require"
  );
  process.exit(1);
}

try {
  const parsed = new URL(connectionString.replace("postgresql://", "http://"));
  if (!parsed.password) {
    console.warn(
      "[Warning] No password detected in DATABASE_URL; this will cause SASL errors."
    );
  }
} catch {
  console.warn(
    "[Warning] Could not parse DATABASE_URL to verify password segment."
  );
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL; relaxed cert for local dev
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
});

// Nodemailer transporter setup for Brevo
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Email template function
function createEmailTemplate(data: {
  fullName: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: string;
  message?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Sintu Decorators</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(234, 179, 8, 0.2);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #fbbf24 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
                ✨ Sintu Decorators ✨
              </h1>
              <p style="margin: 10px 0 0; color: #1a1a1a; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">
                Premium Event Management
              </p>
            </td>
          </tr>
          
          <!-- Golden separator -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, transparent, #eab308, transparent);"></td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #eab308; font-size: 26px; font-weight: 600;">
                Thank You for Contacting Us! 🎉
              </h2>
              
              <p style="margin: 0 0 20px; color: #e5e5e5; font-size: 16px; line-height: 1.6;">
                Dear <strong style="color: #fbbf24;">${data.fullName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #d1d1d1; font-size: 15px; line-height: 1.7;">
                Thank you for reaching out to <strong style="color: #eab308;">Sintu Decorators</strong>! We're thrilled that you're considering us for your special event. Our team of dedicated event specialists has received your inquiry and will review your requirements carefully.
              </p>
              
              <!-- Event Details Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000; border: 2px solid #eab308; border-radius: 12px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 20px; color: #eab308; font-size: 18px; font-weight: 600; border-bottom: 2px solid #ca8a04; padding-bottom: 10px;">
                      📋 Your Event Details
                    </h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; font-weight: 500;">Event Type:</td>
                        <td style="padding: 8px 0; color: #fbbf24; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${data.eventType}</td>
                      </tr>
                      ${data.eventDate ? `
                      <tr>
                        <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; font-weight: 500;">Event Date:</td>
                        <td style="padding: 8px 0; color: #fbbf24; font-size: 14px; font-weight: 600; text-align: right;">${new Date(data.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      </tr>
                      ` : ''}
                      ${data.guestCount ? `
                      <tr>
                        <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; font-weight: 500;">Expected Guests:</td>
                        <td style="padding: 8px 0; color: #fbbf24; font-size: 14px; font-weight: 600; text-align: right;">${data.guestCount}</td>
                      </tr>
                      ` : ''}
                      ${data.phone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; font-weight: 500;">Phone:</td>
                        <td style="padding: 8px 0; color: #fbbf24; font-size: 14px; font-weight: 600; text-align: right;">${data.phone}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; font-weight: 500;">Email:</td>
                        <td style="padding: 8px 0; color: #fbbf24; font-size: 14px; font-weight: 600; text-align: right;">${data.email}</td>
                      </tr>
                    </table>
                    
                    ${data.message ? `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #404040;">
                      <p style="margin: 0 0 8px; color: #a3a3a3; font-size: 13px; font-weight: 500;">Your Message:</p>
                      <p style="margin: 0; color: #e5e5e5; font-size: 14px; line-height: 1.6; font-style: italic; background-color: #1a1a1a; padding: 15px; border-radius: 8px; border-left: 3px solid #eab308;">
                        "${data.message}"
                      </p>
                    </div>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- What's Next -->
              <div style="background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                  ⏱️ What Happens Next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #1a1a1a; font-size: 14px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;"><strong>Review:</strong> Our team will carefully review your event requirements</li>
                  <li style="margin-bottom: 8px;"><strong>Contact:</strong> We'll reach out within <strong>24 hours</strong> to discuss your vision</li>
                  <li style="margin-bottom: 8px;"><strong>Consultation:</strong> Schedule a personalized consultation to plan every detail</li>
                  <li><strong>Magic:</strong> Watch as we transform your event into an unforgettable experience! ✨</li>
                </ul>
              </div>
              
              <p style="margin: 30px 0 20px; color: #d1d1d1; font-size: 15px; line-height: 1.7;">
                With over <strong style="color: #eab308;">25 years of experience</strong> and <strong style="color: #eab308;">500+ successful events</strong>, we're committed to making your celebration extraordinary.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="tel:8969207777" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); color: #000000; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4);">
                      📞 Call Us: 8969207777
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 13px; line-height: 1.6; text-align: center;">
                Need immediate assistance? Feel free to call us or visit our office.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px; border-top: 2px solid #404040;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 15px; color: #eab308; font-size: 18px; font-weight: 600;">
                      Sintu Decorators
                    </p>
                    <p style="margin: 0 0 10px; color: #a3a3a3; font-size: 13px; line-height: 1.6;">
                      📍 Near Shiv Mandir Mungroura, Jamalpur 811214<br>
                      District Munger, Bihar, India
                    </p>
                    <p style="margin: 0 0 10px; color: #a3a3a3; font-size: 13px;">
                      📞 <a href="tel:8969207777" style="color: #eab308; text-decoration: none;">8969207777</a> | 
                      📧 <a href="mailto:nancykumari742004@gmail.com" style="color: #eab308; text-decoration: none;">nancykumari742004@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #737373; font-size: 11px;">
                      © ${new Date().getFullYear()} Sintu Decorators. Creating Timeless Moments Since 1999.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Keep-alive (prevents Neon cold starts adding 5-12s latency to first query after idle)
const KEEP_ALIVE_MS = parseInt(process.env.DB_KEEP_ALIVE_MS || "45000", 10);
if (KEEP_ALIVE_MS > 0) {
  setInterval(async () => {
    const t = performance.now();
    try {
      await pool.query("/* keep-alive */ SELECT 1");
      if (isDev) {
        const dt = (performance.now() - t).toFixed(1);
        console.log(`[DB] keep-alive OK ${dt}ms`);
      }
    } catch (e) {
      console.warn("[DB] keep-alive failed", (e as Error).message);
    }
  }, KEEP_ALIVE_MS).unref();
  if (isDev) console.log(`[DB] keep-alive every ${KEEP_ALIVE_MS}ms`);
}

// Simple in-memory metrics
let lastInsertMs: number | null = null;

// Prepared statement text
const INSERT_CONTACT_SQL = `INSERT INTO contact_submissions
  (full_name, email, phone, event_type, event_date, guest_count, message)
  VALUES ($1,$2,$3,$4,$5,$6,$7)
  RETURNING id, created_at`;

// Startup schema sanity check
(async () => {
  const start = performance.now();
  try {
    await pool.query("SELECT 1");
    const warmMs = (performance.now() - start).toFixed(1);
    console.log(`[Warmup] Initial probe completed in ${warmMs} ms`);
    const col = await pool.query(
      "SELECT data_type FROM information_schema.columns WHERE table_name='contact_submissions' AND column_name='guest_count'"
    );
    const dt = col.rows[0]?.data_type;
    if (dt && dt !== "text") {
      console.warn(
        `[Schema Warning] guest_count column is ${dt}. Expected text. Run:\nALTER TABLE contact_submissions ALTER COLUMN guest_count TYPE TEXT USING guest_count::text;`
      );
    }
  } catch (err) {
    console.warn("[Warmup] Skipped or failed:", (err as Error).message);
  }
})();

interface ContactSubmission {
  fullName: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: string | number;
  message?: string;
}

interface DatabaseInsertResult {
  rows: Array<{
    id: number;
    created_at: Date;
  }>;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

app.post("/api/contact", contactSecurityMiddleware, async (req: Request<object, object, ContactSubmission>, res: Response) => {
  const { fullName, email, phone, eventType, eventDate, guestCount, message } =
    req.body;
  // Validation is handled by middleware, no need to check again
  
  try {
    const guestCountValue: string | null =
      guestCount == null || guestCount === ""
        ? null
        : typeof guestCount === "string"
        ? guestCount.trim()
        : String(guestCount);

    const t0: number = performance.now();
    const result: DatabaseInsertResult = await pool.query({
      text: INSERT_CONTACT_SQL,
      values: [
        fullName,
        email,
        phone || null,
        eventType,
        eventDate ? new Date(eventDate) : null,
        guestCountValue,
        message || null,
      ],
      name: "insert_contact_v1", // prepared statement name for reuse
    });
    lastInsertMs = performance.now() - t0;

    if (isDev)
      console.log(
        `[contact] Insert completed in ${lastInsertMs.toFixed(1)}ms, ID: ${
          result.rows[0].id
        }`
      );

    // Send email to customer
    try {
      const emailHtml: string = createEmailTemplate({
        fullName,
        email,
        phone,
        eventType,
        eventDate,
        guestCount: guestCountValue || undefined,
        message: message || undefined,
      });

      const mailOptions: MailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'Sintu Decorators'} <${process.env.EMAIL_FROM || 'nancykumari742004@gmail.com'}>`,
        to: email,
        subject: `✨ Thank You for Contacting Sintu Decorators - ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
      
      if (isDev) {
        console.log(`[Email] Confirmation sent to ${email}`);
      }
    } catch (emailError) {
      console.error('[Email] Failed to send:', (emailError as Error).message);
      // Don't fail the request if email fails - data is already saved
    }

    res.status(201).json({ success: true, id: result.rows[0].id });
    return; // ensure no further processing

  } catch (e: unknown) {
    console.log(`Error: ${(e as Error).message}`);
    return; // ensure handler exits after sending error
  }
});

// Admin authentication endpoint
interface AdminLoginRequest {
  username: string;
  password: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface AdminLoginErrorResponse {
  error: string;
}

app.post("/api/admin/login", adminSecurityMiddleware, async (req: Request<object, object, AdminLoginRequest>, res: Response<AdminLoginResponse | AdminLoginErrorResponse>) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  
  const adminUsername: string | undefined = process.env.ADMIN_USERNAME;
  const adminPassword: string | undefined = process.env.ADMIN_PASSWORD;
  
  if (username === adminUsername && password === adminPassword) {
    // In production, you should use JWT tokens
    return res.status(200).json({ 
      success: true, 
      message: "Authentication successful",
      token: Buffer.from(`${username}:${password}`).toString('base64') 
    });
  }
  
  return res.status(401).json({ error: "Invalid credentials" });
});

// Admin endpoint to get all submissions
app.get("/api/admin/submissions", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, event_type, event_date, guest_count, message, created_at 
       FROM contact_submissions 
       ORDER BY created_at DESC`
    );
    
    return res.status(200).json({ 
      success: true, 
      submissions: result.rows,
      count: result.rows.length
    });
  } catch (e) {
    console.error('[Admin] Error fetching submissions:', (e as Error).message);
    return res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Admin endpoint to delete a submission
app.delete("/api/admin/submissions/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM contact_submissions WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Submission not found" });
    }
    
    return res.status(200).json({ success: true, message: "Submission deleted" });
  } catch (e) {
    console.error('[Admin] Error deleting submission:', (e as Error).message);
    return res.status(500).json({ error: "Failed to delete submission" });
  }
});

// Apply error handler last (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
