import jwt from "jsonwebtoken"
const authMiddleware = (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                messsage: "No token provided"
            });
        }
        const token = authHeader.startsWith("Bearer")? authHeader.split(" ")[1] : null;
        if(!token){
            return res.status(401).json({
                message: "Invalid token format"
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}
export default authMiddleware