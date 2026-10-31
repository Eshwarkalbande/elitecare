// Centralized error handler. Any `next(err)` call in a route lands here.
function errorHandler(err, req, res, next) {
  console.error("❌", err.message);

  // Duplicate key
  if (err.code === "ER_DUP_ENTRY" || err.code === "23505") {
    return res.status(409).json({ error: "That record already exists." });
  }
  // Foreign key violation -> the referenced parent row does not exist
  if (err.code === "23503") {
    return res.status(400).json({ error: "Related record not found." });
  }
  // Invalid text representation (e.g. bad UUID/date/number input) -> 22P02
  if (err.code === "22P02") {
    return res.status(400).json({ error: "Invalid input." });
  }

  const status = err.status || 500;
  // In production never leak raw internal error messages to the client.
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error."
      : err.message || "Internal server error.";

  res.status(status).json({ error: message });
}

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
