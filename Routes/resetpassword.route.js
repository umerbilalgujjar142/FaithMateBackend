module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    
    const express=require('express')  
    const route=express.Router();

    
    route.get("/user/sendemail",user.SendEmail);
    route.get("/user/verify-otp",user.VerifyOTP);






    app.use("/auth/api",route)

}
