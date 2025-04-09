const Message = require('../models/message');

function chatSocket(io) {
    io.on('connection', (socket) => {
        console.log('✅ New user connected:', socket.id);

        socket.on('joinRoom', ({ userId }) => {
            socket.join(userId);
            console.log(`${userId} joined their room`);
        });

        socket.on('sendMessage', async (data) => {
            const { sender, receiver, content } = data;
            const newMessage = new Message({ sender, receiver, content });
            await newMessage.save();

            io.to(receiver).emit('receiveMessage', newMessage);  // real-time delivery
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });
}

module.exports = chatSocket;
