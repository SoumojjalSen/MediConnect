if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' }); // Load environment variables from .env.local only in local/dev
}
// In production, environment variables should be set by the platform/cloud service.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const Conversation = require('./models/conversation'); // Import Conversation model
const dbConnect = require('./utils/dbConnect'); // Use require for dbConnect

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for CORS
    methods: ['GET', 'POST'], // Allow GET and POST methods
    credentials: true, // Allow credentials
  },
});

// Wrap the database connection in an async function
(async () => {
  try {
    await dbConnect(); // Connect to MongoDB
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if the connection fails
  }
})();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a custom room based on user_uid and doctor_uid sent from frontend
  socket.on('joinRoom', async ({ user_uid, doctor_uid }) => {
    if (!user_uid || !doctor_uid) return;
    const room = `${user_uid}_${doctor_uid}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Retrieve previous conversations
    try {
      const conversation = await Conversation.findOne({ user_uid, doctor_uid });
      if (conversation) {
        socket.emit('previousMessages', conversation.chats); // Send previous messages to the client
      } else {
        socket.emit('previousMessages', []);
      }
    } catch (err) {
      console.error('Error retrieving conversation:', err);
      socket.emit('previousMessages', []);
    }
  });

  // Handle new messages
  socket.on(
    'sendMessage',
    async ({ sender, message, user_uid, doctor_uid }) => {
      if (!user_uid || !doctor_uid) return;
      const room = `${user_uid}_${doctor_uid}`;
      const chatMessage = { sender, message, timestamp: new Date() };

      // Save the message to the database
      try {
        await Conversation.findOneAndUpdate(
          { user_uid, doctor_uid },
          { $push: { chats: chatMessage } },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Error saving message:', err);
      }

      // Broadcast the message to the room
      io.to(room).emit('receiveMessage', chatMessage);
    }
  );

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id); // Log when a user disconnects
  });
});

app.use(cors()); // Use CORS middleware to handle cross-origin requests (API requests)

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/conversations', async (req, res) => {
  const { userId, doctorId } = req.query;

  if (!userId || !doctorId) {
    return res.status(400).json({ error: 'userId and doctorId are required' });
  }

  try {
    const conversation = await Conversation.findOne({ userId, doctorId });

    if (!conversation) {
      return res.status(404).json({ message: 'No conversation found' });
    }

    res.json(conversation);
  } catch (err) {
    console.error('Error retrieving conversation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
