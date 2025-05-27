const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.body.token || req.headers.authorization;
  if (!token)
    return res.status(401).send({ status: 'error', msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ status: 'error', msg: 'Invalid token' });
  }
};
