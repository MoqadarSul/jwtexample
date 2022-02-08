const router = require("express").Router();
const {check, validationResult} = require("express-validator")
const {users} = require("../db")
const bcrypt = require("bcrypt");
const { append } = require("express/lib/response");
const jwt = require("jsonwebtoken")

router.post('/signup', [
    check("email", "Please Provide a valid email").isEmail(),
    check("password", "Please provide a passsword greater than 5 characters").isLength({min: 6})
], async (req, res) =>{
     //VALIDATED THE INPUT
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }   
    const {password, email} = req.body;
    console.log(password, email);
    //VALIDATE IF USER DOESNT ALREADY EXIST
    let user = users.find((user) =>{
        return user.email ===email
    })
    if(user){
        return res.status(400).json({"errors" : [
            {
                "msg" : "This user already exists",
            }
        ]})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        email,
        password : hashedPassword
    })
    const token = await jwt.sign({
        email
    }, "fn32iusht3209hg32263nvh92", {
        expiresIn : 3600000
    })

    res.json({token})
    
})

router.get("/all", (req, res)=>{
    res.send(users)
})


router.post("/login", async (req, res) =>{
    const {password, email} = req.body;
    let user = users.find((user) =>{
        return user.email === email;
    });
    if(!user){
        return res.status(400).json({"errors" : [
            {
                "msg" : "Invalid credentials",
            }
        ]})
    };
    let isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({"errors" : [
            {
                "msg" : "Invalid credentials",
            }
        ]})
    };
    const token = await jwt.sign({
        email
    }, "fn32iusht3209hg32263nvh92", {
        expiresIn : 3600000
    })
    
    res.json({
        token
    })

})


module.exports = router;