const Auth = require('../models/auth');

module.exports = async (req, res, next) => {
  const payload = await Auth.verify(req.cookies.jwt);
  if (!payload) {
      res.status(401).json({
          success: false,
          message: 'Invalid JWT Token'
      });
      return next(new Error('INVALID JWT TOKEN'));
  }
  next();
}