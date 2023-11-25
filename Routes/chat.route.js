module.exports=(app)=>{
    const chat=require('../Controller/chat.controller.js');
    
    const express=require('express')  
    const route=express.Router();
    
    route.post('/sendmessage', chat.sendMessage);
    route.get('/getmessage/:senderId/:receiverId', chat.getMessage);
    




    
    app.use("/auth/api",route)

}
