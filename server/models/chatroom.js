const db = require('../config/database');

class Chatroom {
  // 检查聊天室是否存在
  static checkExists(password, callback) {
    db.get('SELECT * FROM chatrooms WHERE password = ?', [password], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      callback(null, row !== undefined);
    });
  }
  
  // 创建聊天室
  static create(password, callback) {
    db.run('INSERT INTO chatrooms (password) VALUES (?)', [password], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      
      callback(null, this.lastID);
    });
  }
  
  // 获取聊天室ID
  static getId(password, callback) {
    db.get('SELECT id FROM chatrooms WHERE password = ?', [password], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      callback(null, row ? row.id : null);
    });
  }
  
  // 获取所有聊天室
  static getAll(callback) {
    const query = `
      SELECT 
        c.id, 
        c.password, 
        c.createdAt, 
        COUNT(m.id) as messageCount
      FROM chatrooms c
      LEFT JOIN messages m ON c.id = m.chatroomId
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      callback(null, rows);
    });
  }
  
  // 删除聊天室
  static delete(password, callback) {
    // 先获取聊天室ID
    Chatroom.getId(password, (err, chatroomId) => {
      if (err || !chatroomId) {
        callback(err || new Error('Chatroom not found'));
        return;
      }
      
      // 开始事务
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // 删除聊天室的所有消息
        db.run('DELETE FROM messages WHERE chatroomId = ?', [chatroomId]);
        
        // 删除聊天室
        db.run('DELETE FROM chatrooms WHERE id = ?', [chatroomId]);
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            callback(err);
          } else {
            callback(null, true);
          }
        });
      });
    });
  }
}

module.exports = Chatroom;