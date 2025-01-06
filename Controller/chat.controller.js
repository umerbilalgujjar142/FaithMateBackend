const db = require("../Model");
const Chat = db.chat;
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;
  
      const senderChat = await Chat.create({
        senderId: senderId,
        receiverId: receiverId,
        message: message,
      });
      res.status(201).json({
        status: 'success',
        senderChat: senderChat,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
  
  

  exports.getMessage = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
  
      const messages = await Chat.findAll({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
        order: [['createdAt', 'ASC']], 
      });
  
      res.status(200).json({
        status: 'success',
        messages,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
  