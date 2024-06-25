const  utils=require('../utils/auth');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = utils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
