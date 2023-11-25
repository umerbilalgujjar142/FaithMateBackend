const socketIo = require('socket.io');
let io; // Socket.IO instance

const connectedSockets = {}; // Maintain a map of user IDs to their sockets

const addSocket = (userId, socket) => {
  connectedSockets[userId] = socket;
};

const getReceiverSocket = (receiverId) => {
  return connectedSockets[receiverId];
};

const initSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('store_socket', (userId) => {
      addSocket(userId, socket);
    });

    socket.on('send_message', async (msg) => {
      try {
        // Your message handling logic here
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Remove socket from connectedSockets when disconnected, if needed
      // Example: delete connectedSockets[socket.userId];
    });
  });
};

module.exports = { initSocket, addSocket, getReceiverSocket };
