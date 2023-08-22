module.exports=(app)=>{
    const user=require('../Controller/bestmatch.controller.js');
    const  upload = require('../Middleware/statusImage.middleware.js');

    const express=require('express')  
    const route=express.Router();
    
    route.post("/bestmatch",(upload.single('Image')),user.bestMatch);
    route.get("/getBestMatch",user.getBestMatch);
    //apply search filter
    route.get("/getBestMatchFilter",user.getFilteredPosts);



    
    app.use("/auth/api",route)

}
