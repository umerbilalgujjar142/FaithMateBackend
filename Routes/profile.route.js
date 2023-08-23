module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    const upload = require('../Middleware/profileImage.middleware.js');
    
    const express=require('express')  
    const route=express.Router();

    
    route.post("/user/profiledata",upload.single('profileimage'),user.AddProfileData); 
    route.post("/user/Updateprofiledata",user.UpdateProfileData);
    route.get("/user/getprofiledata",user.GetProfileData);




    app.use("/auth/api",route)

}
