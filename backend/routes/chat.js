const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { User } = require('../models/User');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const Chat = require('../models/Chat'); // add at the top


// Send a message (both REST API and Socket.io)
router.post('/send-message', auth, async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        // Validate inputs
        if (!sender || !receiver || !content) {
            return res.status(400).json({ message: 'Sender, receiver, and content are required' });
        }

        // Verify both users exist
        const [senderUser, receiverUser] = await Promise.all([
            User.findOne({ user_id: sender }),
            User.findOne({ user_id: receiver })
        ]);

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        // Create chatId from sorted user IDs for consistency
        const users = [sender, receiver].sort();
        const chatId = `${users[0]}_${users[1]}`;

        const newMessage = new Message({
            sender,
            receiver,
            content,
            chatId
        });

        await newMessage.save();

        // ⬇️ Update or create chat info
        let chat = await Chat.findOne({ chatId });

        if (!chat) {
            // If chat doesn't exist, create it
            chat = new Chat({
                chatId,
                participants: [sender, receiver],
                lastMessage: newMessage._id
            });
        } else {
            // Update existing chat's last message and timestamp
            chat.lastMessage = newMessage._id;
            chat.updatedAt = Date.now();
        }

        await chat.save();

        // Emit via socket if available
        if (req.io) {
            req.io.to(receiver).emit('receiveMessage', newMessage);
            req.io.to(sender).emit('messageSent', newMessage);
        }

        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully', 
            data: newMessage 
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// Get all chat threads for a user
router.get('/chats/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Validate user exists
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all chat conversations for this user
        const chats = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$chatId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ['$receiver', userId] },
                                    { $eq: ['$read', false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { 'lastMessage.timestamp': -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { 
                        chatId: '$_id', 
                        currentUserId: userId 
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ne: ['$user_id', '$$currentUserId'] },
                                        {
                                            $or: [
                                                { $regexMatch: { input: '$$chatId', regex: { $concat: ['$user_id', '_.*'] } } },
                                                { $regexMatch: { input: '$$chatId', regex: { $concat: ['.*_', '$user_id'] } } }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                user_id: 1,
                                firstName: 1,
                                lastName: 1,
                                avatar: 1,
                                userType: 1
                            }
                        }
                    ],
                    as: 'otherUser'
                }
            },
            {
                $unwind: '$otherUser'
            }
        ]);

        res.status(200).json({
            success: true,
            count: chats.length,
            data: chats
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats' });
    }
});

// Get conversation history between two users
router.get('/messages', auth, async (req, res) => {
    try {
        const { sender, receiver, page = 1, limit = 50 } = req.query;
        
        // Validate inputs
        if (!sender || !receiver) {
            return res.status(400).json({ message: 'Both sender and receiver IDs are required' });
        }

        // Create chatId from sorted user IDs for consistency
        const users = [sender, receiver].sort();
        const chatId = `${users[0]}_${users[1]}`;
        
        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Fetch paginated messages between the users
        const messages = await Message.find({ chatId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        // Get total count for pagination
        const totalMessages = await Message.countDocuments({ chatId });
            
        // Mark messages as read if current user is the receiver
        if (req.user.user_id === receiver) {
            await Message.updateMany(
                { chatId, receiver, read: false },
                { $set: { read: true } }
            );
            
            // Notify sender through socket that messages were read
            if (req.io) {
                req.io.to(sender).emit('messagesRead', { 
                    chatId,
                    reader: receiver
                });
            }
        }

        res.status(200).json({
            success: true,
            count: messages.length,
            total: totalMessages,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalMessages / parseInt(limit)),
            data: messages.reverse() // Return in chronological order (oldest first)
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Mark messages as read
router.put('/mark-read', auth, async (req, res) => {
    try {
        const { messageIds } = req.body;
        const userId = req.user.user_id;
        
        if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
            return res.status(400).json({ message: 'Valid message IDs array is required' });
        }
        
        const result = await Message.updateMany(
            { _id: { $in: messageIds }, receiver: userId, read: false },
            { $set: { read: true } }
        );
        
        // Notify senders through socket that messages were read
        if (req.io && result.modifiedCount > 0) {
            const messages = await Message.find({ _id: { $in: messageIds } });
            
            // Group messages by sender to emit events
            const senderMessages = messages.reduce((acc, message) => {
                if (!acc[message.sender]) {
                    acc[message.sender] = [];
                }
                acc[message.sender].push(message._id);
                return acc;
            }, {});
            
            // Emit to each sender
            Object.keys(senderMessages).forEach(sender => {
                req.io.to(sender).emit('messagesRead', {
                    messageIds: senderMessages[sender],
                    reader: userId
                });
            });
        }

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} messages marked as read`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Error marking messages as read' });
    }
});

// Get unread message count
router.get('/unread-count/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Validate user exists
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Count unread messages
        const unreadCount = await Message.countDocuments({ 
            receiver: userId,
            read: false
        });
        
        res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Error fetching unread message count' });
    }
});

module.exports = router;