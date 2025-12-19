/**
 * Get cookie options for authentication cookies
 * Optimized for iOS Safari compatibility when frontend and backend are on different domains
 * 
 * @param maxAge - Cookie max age in milliseconds (default: 1 day)
 * @returns Cookie options object
 */
export const getAuthCookieOptions = (maxAge: number = 86400000) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction, // Must be true when sameSite is 'none' (iOS Safari requirement)
    maxAge: maxAge,
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain cookies on iOS
  };
  
  // Don't set domain in production when frontend/backend are on different domains
  // Setting domain can prevent cookies from working across different Vercel domains
  if (!isProduction) {
    cookieOptions.domain = 'localhost';
  }
  
  return cookieOptions;
};

