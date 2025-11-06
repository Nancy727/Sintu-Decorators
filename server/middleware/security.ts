import { Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Stricter rate limiter for contact form
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: "Too many contact form submissions, please try again later.",
  skipSuccessfulRequests: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "You can only submit the contact form 5 times per hour.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Aggressive rate limiter for admin login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many login attempts",
      message: "Account temporarily locked. Please try again later.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "") // Remove < and > to prevent script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
    .trim()
    .slice(0, 5000); // Limit length to prevent memory attacks
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  return phoneRegex.test(phone);
}

// Validate date format
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    !isNaN(date.getTime()) &&
    date > new Date("1900-01-01") &&
    date < new Date("2100-01-01")
  );
}

// Middleware to validate contact form input
export function validateContactInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { fullName, email, phone, eventType, eventDate, guestCount, message } =
    req.body;

  // Check required fields
  if (!fullName || !email || !eventType) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Full name, email, and event type are required.",
    });
  }

  // Validate and sanitize fullName
  if (
    typeof fullName !== "string" ||
    fullName.length < 2 ||
    fullName.length > 100
  ) {
    return res.status(400).json({
      error: "Invalid input",
      message: "Full name must be between 2 and 100 characters.",
    });
  }
  req.body.fullName = sanitizeString(fullName);

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "Invalid email",
      message: "Please provide a valid email address.",
    });
  }
  req.body.email = sanitizeString(email.toLowerCase());

  // Validate phone if provided
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({
      error: "Invalid phone",
      message: "Please provide a valid phone number.",
    });
  }
  if (phone) req.body.phone = sanitizeString(phone);

  // Validate eventType
  const validEventTypes = [
    "wedding",
    "birthday",
    "corporate",
    "anniversary",
    "other",
  ];
  if (!validEventTypes.includes(eventType.toLowerCase())) {
    return res.status(400).json({
      error: "Invalid event type",
      message: "Please select a valid event type.",
    });
  }
  req.body.eventType = eventType.toLowerCase();

  // Validate eventDate if provided
  if (eventDate && !isValidDate(eventDate)) {
    return res.status(400).json({
      error: "Invalid date",
      message: "Please provide a valid event date.",
    });
  }

  // Validate guestCount if provided
  if (guestCount !== null && guestCount !== undefined && guestCount !== "") {
    const count = parseInt(guestCount);
    if (isNaN(count) || count < 1 || count > 10000) {
      return res.status(400).json({
        error: "Invalid guest count",
        message: "Guest count must be between 1 and 10,000.",
      });
    }
  }

  // Sanitize message if provided
  if (message) {
    if (typeof message !== "string" || message.length > 2000) {
      return res.status(400).json({
        error: "Invalid message",
        message: "Message must not exceed 2000 characters.",
      });
    }
    req.body.message = sanitizeString(message);
  }

  next();
}

// Middleware to detect common SQL injection patterns
export function sqlInjectionProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const checkValue = (value: unknown): boolean => {
    if (typeof value !== "string") return false;

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|DECLARE)\b)/gi,
      /(--|;|\/\*|\*\/|xp_|sp_)/gi,
      /('|"|`|;|\||&|\$)/g,
    ];

    return sqlPatterns.some((pattern) => pattern.test(value));
  };

  // Check all string values in body, query, and params
  const checkObject = (obj: Record<string, unknown>): boolean => {
    for (const key in obj) {
      if (typeof obj[key] === "string" && checkValue(obj[key])) {
        return true;
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        if (checkObject(obj[key] as Record<string, unknown>)) return true;
      }
    }
    return false;
  };

  if (
    checkObject(req.body) ||
    checkObject(req.query) ||
    checkObject(req.params)
  ) {
    console.warn(
      `[Security] Potential SQL injection attempt from IP: ${req.ip}`
    );
    return res.status(400).json({
      error: "Invalid input",
      message: "Request contains invalid characters.",
    });
  }

  next();
}

export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Strict Transport Security (HSTS)
  if (req.secure) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  next();
}

export function requestSizeLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const contentLength = parseInt(req.headers["content-length"] || "0");
  const maxSize = 1024 * 1024; // 1MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: "Payload too large",
      message: "Request body must not exceed 1MB.",
    });
  }

  next();
}

export function corsProtection(allowedOrigins: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    next();
  };
}

export function honeypotProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check for common honeypot field names
  const honeypotFields = ["website", "url", "homepage", "captcha", "bot_field"];

  for (const field of honeypotFields) {
    if (req.body[field]) {
      console.warn(`[Security] Honeypot triggered from IP: ${req.ip}`);
      // Return success to fool bots, but don't process
      return res
        .status(200)
        .json({ success: true, message: "Form submitted successfully" });
    }
  }

  next();
}

const blockedIPs = new Set<string>();
const suspiciousActivity = new Map<
  string,
  { count: number; lastActivity: number }
>();

export function ipBlockingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Check if IP is blocked
  if (blockedIPs.has(ip)) {
    console.warn(`[Security] Blocked IP attempted access: ${ip}`);
    return res.status(403).json({
      error: "Forbidden",
      message: "Your IP address has been blocked due to suspicious activity.",
    });
  }

  // Track suspicious activity
  const now = Date.now();
  const activity = suspiciousActivity.get(ip);

  if (activity) {
    const timeDiff = now - activity.lastActivity;

    // If more than 50 requests in 1 minute, block the IP
    if (timeDiff < 60000 && activity.count > 50) {
      blockedIPs.add(ip);
      console.warn(`[Security] IP blocked for excessive requests: ${ip}`);
      return res.status(403).json({
        error: "Forbidden",
        message: "Your IP address has been blocked due to excessive requests.",
      });
    }

    // Reset count if more than 1 minute has passed
    if (timeDiff > 60000) {
      suspiciousActivity.set(ip, { count: 1, lastActivity: now });
    } else {
      suspiciousActivity.set(ip, {
        count: activity.count + 1,
        lastActivity: now,
      });
    }
  } else {
    suspiciousActivity.set(ip, { count: 1, lastActivity: now });
  }

  next();
}

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, activity] of suspiciousActivity.entries()) {
    if (now - activity.lastActivity > 3600000) {
      // 1 hour
      suspiciousActivity.delete(ip);
    }
  }
}, 3600000);

export function timingAttackPrevention(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const randomDelay = Math.floor(Math.random() * 100); // 0-100ms random delay
  setTimeout(() => next(), randomDelay);
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString();
    const [username, password] = decoded.split(":");

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials.",
      });
    }

    next();
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid authentication format.",
    });
  }
}

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[Error]", err);
  void _next;

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== "production";

  res.status(err.status || 500).json({
    error: "Internal server error",
    message: isDev
      ? err.message
      : "An unexpected error occurred. Please try again later.",
    ...(isDev && { stack: err.stack }),
  });
}

export const securityMiddleware = [
  securityHeaders,
  requestSizeLimit,
  ipBlockingMiddleware,
];

export const contactSecurityMiddleware = [
  ...securityMiddleware,
  contactLimiter,
  honeypotProtection,
  validateContactInput,
];

export const adminSecurityMiddleware = [
  ...securityMiddleware,
  loginLimiter,
  timingAttackPrevention,
];
