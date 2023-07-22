module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    const { authJwt } = require("../Middleware");    
    const express=require('express')  
    const route=express.Router();

    
    route.post("/user/register",user.userRegister);
    route.post("/user/login",user.userLogin);

    
    route.put("/user/updatedPassword",([authJwt.verifyToken]),user.updatePassword);





    app.use("/auth/api",route)

}
