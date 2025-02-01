import JWT from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req?.headers?.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).json({
        status: "fail",
        message: "Unauthorized"
    })

    const token = authHeader.split(" ")[1];

    try {
        //Verify token  format as it is created
        const userToken = JWT.verify(token, process.env.JWT_SECRET);

        //Attach user to request
        req.body.user = {
            userId: userToken.userId,
        };

        //change request, then go to next middleware
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "fail",
            message: "authentication error"
        })
    }
}   