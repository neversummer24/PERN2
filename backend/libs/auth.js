import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log(error);
        return false
    } 
}

export const createJWT = (id) => {
    return JWT.sign({userId:id}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

export const isTokenValid = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
}

