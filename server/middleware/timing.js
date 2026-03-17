// timing.js — Request performance monitoring middleware
//
// Measures the wall-clock time for every HTTP request and logs it.
// Slow requests ( > 500 ms ) are flagged separately so they're easy to spot.
//
// Usage: register BEFORE your routes in server.js
//   import timingMiddleware from './middleware/timing.js';
//   app.use(timingMiddleware);

const timingMiddleware = (req, res, next) => {
    const start = Date.now();

    // 'finish' fires after the last byte of the response has been flushed
    res.on('finish', () => {
        const duration = Date.now() - start;
        const label = `${req.method} ${req.originalUrl}`;

        if (duration > 500) {
            // Highlight problematic routes — investigate these first
            console.warn(`🐌 SLOW REQUEST (${duration}ms): ${label}`);
        } else if (process.env.NODE_ENV === 'development') {
            console.log(`⏱  ${duration}ms  ${label}`);
        }
    });

    next();
};

export default timingMiddleware;
