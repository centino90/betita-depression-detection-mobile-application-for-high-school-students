import dotenvSafe from "dotenv-safe"
dotenvSafe.config()
import knex from "knex"

export function dbMiddleware() {    
    const db = knex({
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
    });

    return async (req, res, next) => {      
        req.db = db        
        return await next();
    };
}

export function _db(req) {
    return req.db;
}