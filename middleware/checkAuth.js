const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) =>{
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(400).json({"errors" : [
            {
                "msg" : "No token Found",
            }
        ]})
    };

    try{
        let user = await jwt.verify(token, "fn32iusht3209hg32263nvh92")
        req.user = user.email;
        next();
    }catch(error){
        return res.status(400).json({"errors" : [
            {
                "msg" : "Invalid token",
            }
        ]})
    }
}