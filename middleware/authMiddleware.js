const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode || !decode.id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
        }
        req.user = decode;
        next();
        
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
}

module.exports = authMiddleware;