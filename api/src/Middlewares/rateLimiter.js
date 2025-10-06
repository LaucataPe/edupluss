const rateLimit = require('express-rate-limit');

// Rate limiter for login endpoint - very restrictive
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Demasiados intentos de login. Por favor, intenta nuevamente en 15 minutos.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (only count failed logins)
  skipSuccessfulRequests: false,
  // Skip failed requests to only count successful logins (optional)
  skipFailedRequests: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Demasiados intentos de login. Por favor, intenta nuevamente en 15 minutos.'
    });
  },
});

// Rate limiter for refresh token endpoint - moderate
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Allow more refresh attempts
  message: 'Demasiadas solicitudes de renovación de token. Intenta en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Demasiadas solicitudes de renovación de token. Intenta en 15 minutos.'
    });
  },
});

// General API rate limiter - permissive (optional, for future use)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Demasiadas solicitudes. Por favor, intenta más tarde.'
    });
  },
});

module.exports = {
  loginLimiter,
  refreshLimiter,
  apiLimiter,
};
