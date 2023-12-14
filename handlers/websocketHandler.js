const logger=require('../models/logger')

const { getMessages, saveMessageDatabase, storeMessageRedis } =require('../controllers/messageController');

function handleWebSocketConnection(ws) {
  logger.info('Client connected');

  getMessages(ws);

  ws.on('message', async (message) => {
    logger.info(`Received: ${message}`);

    try {
      const newMessage = await saveMessageDatabase(message);
      storeMessageRedis(message);
    } catch (error) {
      logg.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    logger.info('Client disconnected');
  });
}

module.exports = { handleWebSocketConnection };
