// middleware/logger.js
const logger = (req, res, next) => {
    console.log(`Request to ${req.method} ${req.originalUrl} at ${new Date().toISOString()},aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`);
    next();
  };
  
  module.exports = logger;
  