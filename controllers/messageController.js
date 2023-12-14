const Message = require('../models/message');
const { Redis } = require('ioredis');
const logger=require('../models/logger')
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
    logger.error('Error fetching messages:', error);
  }
}

async function saveMessageDatabase(content) {
  const newMessage = new Message({ content });
  try {
    await newMessage.save();
    logger.info('Message saved to MongoDB');
    return newMessage;
  } catch (err) {
    logger.error('Error saving message to MongoDB:', err);
    throw err;
  }
}

function storeMessageRedis(message) {
  redisClient.rpush('messages', message, (err, reply) => {
    if (err) {
      logger.error('Error storing message in Redis:', err);
    } else {
      logger.info('Message stored in Redis');
    }
  });
}

module.exports = { getMessages, saveMessageDatabase, storeMessageRedis };
