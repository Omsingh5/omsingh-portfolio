export const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || "Internal server error";

  if (err.name === "ValidationError") {
    status  = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }
  if (err.code === 11000) {
    status  = 409;
    message = `Duplicate value: ${Object.keys(err.keyValue).join(", ")}`;
  }
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  res.status(status).json({ success: false, error: message });
};