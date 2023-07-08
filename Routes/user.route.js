module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    
    const express=require('express')  
    const route=express.Router();

    
    route.post("/user/register",user.userRegister);
    route.post("/user/login",user.userLogin);





    app.use("/auth/api",route)

}
