import jwt from 'jsonwebtoken'
import dotenvSafe from "dotenv-safe"
dotenvSafe.config()

export function verifyCookieJwtAuth() {    
    return async (req, res, next) => {        
        const token = req.headers.authorization
        const raw = parseJwt(token)
        
        try {
            const user = jwt.verify(raw, process.env.AUTH_TOKEN_SECRET);            
            req.user = user;
            return await next()
        } catch (err) {            
            return res.status(403).json({
                error: "Forbidden"
            })
        }
    }
}

function parseJwt(bearerToken) {
	if (bearerToken === undefined) {
		return false
	}
	const [prefix, raw] = bearerToken.split(' ')
	if (prefix !== "Bearer") {
		return false
	}

    return raw
}