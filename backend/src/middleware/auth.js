import jwt from "jsonwebtoken";

/**
 * Auth middleware: expects Authorization: Bearer <token>
 * and sets req.user.id from token subject.
 */
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
