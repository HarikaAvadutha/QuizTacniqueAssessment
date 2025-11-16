const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

module.exports = {
  generateToken: (adminId) => {
    return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '24h' });
  },
  
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },
  
  authMiddleware: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });
    
    req.adminId = decoded.adminId;
    next();
  }
};
