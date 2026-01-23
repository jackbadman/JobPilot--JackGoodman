export default function authMiddleware(req, res, next) {
  // Dev placeholder user to avoid 500s until real auth is wired.
  req.user = { id: "000000000000000000000000" };
  next();
}
