module.exports=(app)=>{
    const user=require('../Controller/user.controller.js');
    const  upload = require('../Middleware/statusImage.middleware.js');

    const { authJwt } = require("../Middleware");    
    const express=require('express')  
    const route=express.Router();

    
    route.post("/user/register",user.userRegister);
    route.post("/user/login",user.userLogin);


    //upload status
    route.post("/user/uploadStatus",([authJwt.verifyToken],(upload.single('Image'))),user.uploadStatus);
    //get status 
    route.get("/user/getStatus",([authJwt.verifyToken]),user.getStatus);

    route.put("/user/updatedPassword",([authJwt.verifyToken]),user.updatePassword);








    app.use("/auth/api",route)

}
