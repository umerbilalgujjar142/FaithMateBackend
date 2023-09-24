module.exports=(app)=>{
    const user=require('../Controller/bestmatch.controller.js');
    const  upload = require('../Middleware/statusImage.middleware.js');

    const express=require('express')  
    const route=express.Router();
    
    route.post("/bestmatch",(upload.single('Image')),user.bestMatch);
    route.get("/getBestMatch",user.getBestMatch);
    //apply search filter
    route.post("/getBestMatchFilter",user.getFilteredPosts);

    //get single match details by id
    route.get("/getSingleBest",user.getSingleBestMatch);

    route.post("/updateLikeStatus",user.updateLikeStatus);
    route.post("/updateFavouriteStatus",user.updateFavouriteStatus);

    route.get("/getBasedLikedStatus",user.GetBasedLikedStatus);
    route.get("/getFavouriteStatus",user.GetBasedFavouriteStatus);



    
    app.use("/auth/api",route)

}
