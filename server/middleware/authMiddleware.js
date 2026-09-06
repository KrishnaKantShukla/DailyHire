const jwt = require('jsonwebtoken');
const { User, isConnected, memoryStore } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dailyhire_jwt_secret_key_2026';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (isConnected()) {
      let user = null;
      if (typeof userId === 'string' && userId.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(userId).select('-password');
      }
      if (!user && decoded.email) {
        user = await User.findOne({ email: decoded.email }).select('-password');
      }
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Memory Store Fallback
    const memUser = memoryStore.users.find(
      (u) => u.id === userId || u._id === userId || (decoded.email && u.email === decoded.email)
    );
    if (memUser) {
      req.user = memUser;
      return next();
    }

    return res.status(401).json({ message: 'User not found or session expired.' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;

