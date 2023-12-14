const Message = require('../models/message');
const { Redis } = require('ioredis');
require('dotenv').config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

async function getMessages(ws) {
  try {
    const messages = await Message.find().exec();
    messages.forEach((message) => {
      ws.send(`Previous message: ${message.content}`);
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

async function saveMessageDatabase(content) {
  const newMessage = new Message({ content });
  try {
    await newMessage.save();
    console.log('Message saved to MongoDB');
    return newMessage;
  } catch (err) {
    console.error('Error saving message to MongoDB:', err);
    throw err;
  }
}

function storeMessageRedis(message) {
  redisClient.rpush('messages', message, (err, reply) => {
    if (err) {
      console.error('Error storing message in Redis:', err);
    } else {
      console.log('Message stored in Redis');
    }
  });
}

module.exports = { getMessages, saveMessageDatabase, storeMessageRedis };
