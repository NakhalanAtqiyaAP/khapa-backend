const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./tokenOut'); 
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      'rc': '45',
      success: false,
      msg: 'Token tidak ditemukan'
    });
  }

  if (tokenBlacklist.isTokenBlacklisted(token)) {
    return res.status(401).json({
      'rc': '46',
      success: false,
      msg: 'Token telah kadaluwarsa'
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        'rc': '47',
        success: false,
        msg: 'Token tidak valid'
      });
    }

    // console.log('Decoded JWT:', decoded); 
    req.user = decoded; 
    next();
  });
};

module.exports = authMiddleware;
