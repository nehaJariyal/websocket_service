const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const messageSchema = new mongoose.Schema({
  content: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
