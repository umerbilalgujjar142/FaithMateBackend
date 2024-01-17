module.exports=(app)=>{
    const user=require('../Controller/subscription.controller.js');
    
    const express=require('express')  
    const route=express.Router();

    route.post("/user/postSubscription",user.userSubscription);
    route.get("/user/getSubscription",user.getSubscription);


    
    app.use("/auth/api",route)

}
