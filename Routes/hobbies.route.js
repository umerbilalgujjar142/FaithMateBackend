module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    
    const express=require('express')  
    const route=express.Router();
    
    route.post("/user/hobbies",user.userHobbies);



    
    app.use("/auth/api",route)

}
