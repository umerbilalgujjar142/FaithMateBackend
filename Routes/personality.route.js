module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    
    const express=require('express')  
    const route=express.Router();

    route.post("/user/personality",user.userPersonality);    



    
    app.use("/auth/api",route)

}
