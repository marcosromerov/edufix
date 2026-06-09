// Augment Express Request with auth fields set by requireAuth middleware.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}
export {};
