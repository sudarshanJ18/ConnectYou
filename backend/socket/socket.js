const Message = require('../models/message');
const Chat = require('../models/Chat');

module.exports = (io) => {
    // Store online users
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Handle user joining
        socket.on('joinRoom', async ({ userId }) => {
            if (userId) {
                socket.join(userId);
                onlineUsers.set(userId, socket.id);
                console.log(`User ${userId} joined their room`);
            }
        });

        // Handle typing events
        socket.on('typing', ({ sender, receiver }) => {
            io.to(receiver).emit('userTyping', { sender });
        });

        socket.on('stopTyping', ({ sender, receiver }) => {
            io.to(receiver).emit('userStopTyping', { sender });
        });

        // Handle message read status
        socket.on('markAsRead', async ({ messageIds, userId }) => {
            try {
                await Message.updateMany(
                    { _id: { $in: messageIds } },
                    { $set: { read: true } }
                );
                
                // Notify sender that messages were read
                const messages = await Message.find({ _id: { $in: messageIds } });
                messages.forEach(msg => {
                    io.to(msg.sender).emit('messageRead', {
                        messageId: msg._id,
                        chatId: msg.chatId
                    });
                });
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            // Remove user from online users
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });
};