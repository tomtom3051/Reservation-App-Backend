const jwt = require('jsonwebtoken');
/**
 * Authenticates that the request has a json web token attached to it.
 * If not request is rejected.
 * @param {*} req: request from front end 
 * @param {*} res: response from backend 
 * @param {*} next: the request goes somewhere else next 
 * @returns 
 */
function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        req.userData = decodedToken;
        next();
    } catch(e) {
        return res.status(401).json({
            'message': 'Invalid or expired token provided',
            'error': e
        });
    }
}

module.exports = {
    checkAuth: checkAuth
}