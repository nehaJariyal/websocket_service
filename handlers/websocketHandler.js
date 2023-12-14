const { getMessages, saveMessageDatabase, storeMessageRedis } =require('../controllers/messageController');

function handleWebSocketConnection(ws) {
  console.log('Client connected');

  getMessages(ws);

  ws.on('message', async (message) => {
    console.log(`Received: ${message}`);

    try {
      const newMessage = await saveMessageDatabase(message);
      storeMessageRedis(message);
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}

module.exports = { handleWebSocketConnection };
