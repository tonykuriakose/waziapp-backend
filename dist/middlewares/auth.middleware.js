import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
                return;
            }
            req.user = decoded;
            next();
        });
    }
    else {
        res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
};
//# sourceMappingURL=auth.middleware.js.map