const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// 发送消息
router.post('/send', (req, res) => {
  const { password, nickname, content } = req.body;
  
  if (!password || !nickname || !content) {
    return res.json({ success: false, message: 'Missing required fields' });
  }
  
  Message.send(password, nickname, content, (err, message) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, message });
  });
});

// 获取历史消息
router.post('/history', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.json({ success: false, message: 'Password is required' });
  }
  
  Message.getByChatroom(password, (err, messages) => {
    if (err) {
      console.error('Error getting messages:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, messages });
  });
});

module.exports = router;