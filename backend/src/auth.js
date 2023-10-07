import dotenvSafe from "dotenv-safe"
dotenvSafe.config()
import bcrypt from 'bcrypt'

const saltRounds = process.env.AUTH_SALT_ROUNDS ?? 10;

export async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds)
}

async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export async function fetchUser(email, pwd, db) {
    const fetchedUser = await db
        .select('id', 'email', 'password', 'age', 'gender', 'isAdmin', 'symptom', 'answer')
        .from('Users')
        .where('email', email)

    if (!fetchedUser[0]) {
        return false
    }
    const {password, ...userProps} = fetchedUser[0]    
    return await verifyPassword(pwd, fetchedUser[0]?.password) === true ? userProps : false;
}