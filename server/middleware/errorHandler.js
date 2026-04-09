// Global error-handling middleware
// IMPORTANT: Must have exactly 4 parameters so Express recognises it as error middleware
const errorHandler = (err, req, res, next) => {
    // Log full error details server-side for developers
    console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message || err);

    // Use status attached to the error, or fall back to 500
    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};

export default errorHandler;
