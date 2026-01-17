const express = require('express');
const router = express.Router();
const Chatroom = require('../models/chatroom');

// 检查聊天室是否存在
router.post('/check', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.json({ success: false, message: 'Password is required' });
  }
  
  Chatroom.checkExists(password, (err, exists) => {
    if (err) {
      console.error('Error checking chatroom:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    if (exists) {
      return res.json({ success: true, message: 'Chatroom exists' });
    } else {
      // 如果聊天室不存在，创建新的聊天室
      Chatroom.create(password, (err, chatroomId) => {
        if (err) {
          console.error('Error creating chatroom:', err);
          return res.json({ success: false, message: 'Server error' });
        }
        
        return res.json({ success: true, message: 'Chatroom created' });
      });
    }
  });
});

module.exports = router;