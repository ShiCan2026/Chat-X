const db = require('../config/database');
const Chatroom = require('./chatroom');

class Message {
  // 发送消息
  static send(password, nickname, content, callback) {
    // 获取聊天室ID
    Chatroom.getId(password, (err, chatroomId) => {
      if (err || !chatroomId) {
        callback(err || new Error('Chatroom not found'));
        return;
      }
      
      // 插入消息
      db.run(
        'INSERT INTO messages (chatroomId, nickname, content) VALUES (?, ?, ?)',
        [chatroomId, nickname, content],
        function(err) {
          if (err) {
            callback(err, null);
            return;
          }
          
          // 获取完整消息
          db.get(
            'SELECT * FROM messages WHERE id = ?',
            [this.lastID],
            (err, row) => {
              if (err) {
                callback(err, null);
                return;
              }
              
              callback(null, row);
            }
          );
        }
      );
    });
  }
  
  // 获取聊天室消息（最多100条）
  static getByChatroom(password, callback) {
    // 获取聊天室ID
    Chatroom.getId(password, (err, chatroomId) => {
      if (err || !chatroomId) {
        callback(err || new Error('Chatroom not found'));
        return;
      }
      
      // 获取消息，按时间排序，最多100条
      db.all(
        'SELECT * FROM messages WHERE chatroomId = ? ORDER BY createdAt DESC LIMIT 100',
        [chatroomId],
        (err, rows) => {
          if (err) {
            callback(err, null);
            return;
          }
          
          // 反转消息顺序，使最新的消息在最后
          callback(null, rows.reverse());
        }
      );
    });
  }
  
  // 删除消息
  static delete(password, messageId, callback) {
    // 获取聊天室ID
    Chatroom.getId(password, (err, chatroomId) => {
      if (err || !chatroomId) {
        callback(err || new Error('Chatroom not found'));
        return;
      }
      
      // 删除消息
      db.run(
        'DELETE FROM messages WHERE id = ? AND chatroomId = ?',
        [messageId, chatroomId],
        function(err) {
          if (err) {
            callback(err, null);
            return;
          }
          
          callback(null, this.changes > 0);
        }
      );
    });
  }
  
  // 获取聊天室的所有消息（管理员用）
  static getAllByChatroom(password, callback) {
    // 获取聊天室ID
    Chatroom.getId(password, (err, chatroomId) => {
      if (err || !chatroomId) {
        callback(err || new Error('Chatroom not found'));
        return;
      }
      
      // 获取所有消息，按时间排序
      db.all(
        'SELECT * FROM messages WHERE chatroomId = ? ORDER BY createdAt ASC',
        [chatroomId],
        (err, rows) => {
          if (err) {
            callback(err, null);
            return;
          }
          
          callback(null, rows);
        }
      );
    });
  }
}

module.exports = Message;