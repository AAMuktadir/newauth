import jwt from "jsonwebtoken";

const checkLogin = (req, res, next) =>{
    const {authorization} = req.headers;
    console.log(authorization);

    try{
        const token = authorization.split(' ')[1];
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.userName;
        req.userName = username;
        req.id = decoded.id;
        req.name = decoded.name;
        next();
    }
    catch (err){
        console.log(err);
        next("Authentication Failure! \n please login");
        res.status(404).json({
            "message" : "Authentication Failure! \n please login"
        })
    }
};

module.exports = checkLogin;