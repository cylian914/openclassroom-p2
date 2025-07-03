const tk = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = tk.verify(token, process.env.TokenKey);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};
