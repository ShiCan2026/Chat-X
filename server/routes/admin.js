const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Chatroom = require('../models/chatroom');
const Message = require('../models/message');

// 管理员登录
router.post('/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.json({ success: false, message: 'Password is required' });
  }
  
  Admin.verifyPassword(password, (err, isValid) => {
    if (err) {
      console.error('Error verifying admin password:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    if (isValid) {
      return res.json({ success: true, message: 'Login successful' });
    } else {
      return res.json({ success: false, message: 'Invalid password' });
    }
  });
});

// 修改管理员密码
router.post('/change-password', (req, res) => {
  const { newPassword } = req.body;
  
  if (!newPassword) {
    return res.json({ success: false, message: 'New password is required' });
  }
  
  Admin.changePassword(newPassword, (err) => {
    if (err) {
      console.error('Error changing admin password:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, message: 'Password changed successfully' });
  });
});

// 获取所有聊天室
router.get('/chatrooms', (req, res) => {
  Chatroom.getAll((err, chatrooms) => {
    if (err) {
      console.error('Error getting chatrooms:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, chatrooms });
  });
});

// 获取聊天室消息
router.post('/messages', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.json({ success: false, message: 'Password is required' });
  }
  
  Message.getAllByChatroom(password, (err, messages) => {
    if (err) {
      console.error('Error getting messages:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, messages });
  });
});

// 删除聊天室
router.post('/delete-chatroom', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.json({ success: false, message: 'Password is required' });
  }
  
  Chatroom.delete(password, (err) => {
    if (err) {
      console.error('Error deleting chatroom:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    return res.json({ success: true, message: 'Chatroom deleted successfully' });
  });
});

// 删除消息
router.post('/delete-message', (req, res) => {
  const { password, messageId } = req.body;
  
  if (!password || !messageId) {
    return res.json({ success: false, message: 'Password and message ID are required' });
  }
  
  Message.delete(password, messageId, (err, success) => {
    if (err) {
      console.error('Error deleting message:', err);
      return res.json({ success: false, message: 'Server error' });
    }
    
    if (success) {
      return res.json({ success: true, message: 'Message deleted successfully' });
    } else {
      return res.json({ success: false, message: 'Message not found' });
    }
  });
});

module.exports = router;