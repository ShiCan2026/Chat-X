const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建数据库连接
const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    // 创建管理员表
    db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating admin table:', err.message);
      }
    });
    
    // 创建聊天室表
    db.run(`CREATE TABLE IF NOT EXISTS chatrooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT NOT NULL UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating chatrooms table:', err.message);
      }
    });
    
    // 创建消息表
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatroomId INTEGER,
      nickname TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chatroomId) REFERENCES chatrooms(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating messages table:', err.message);
      }
    });
    
    // 初始化管理员密码（如果不存在）
    db.get('SELECT * FROM admin WHERE id = 1', (err, row) => {
      if (err) {
        console.error('Error checking admin:', err.message);
      } else if (!row) {
        // 初始密码为123456
        db.run('INSERT INTO admin (password) VALUES (?)', ['123456'], (err) => {
          if (err) {
            console.error('Error creating admin:', err.message);
          } else {
            console.log('Admin user created with initial password: 123456');
          }
        });
      }
    });
  }
});

module.exports = db;