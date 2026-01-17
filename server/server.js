const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

// 创建Express应用
const app = express();
app.use(express.json());
app.use(cors());

// 创建HTTP服务器
const server = http.createServer(app);

// 创建WebSocket服务器
const wss = new WebSocket.Server({ server });

// WebSocket连接管理
const clients = new Map();

wss.on('connection', (ws, req) => {
  // 从URL参数获取聊天室口令
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const password = urlParams.get('password');
  
  if (!password) {
    ws.close();
    return;
  }
  
  // 将客户端添加到对应聊天室
  if (!clients.has(password)) {
    clients.set(password, new Set());
  }
  clients.get(password).add(ws);
  
  console.log(`Client connected to chatroom ${password}`);
  
  // 监听客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // 广播消息到聊天室的所有客户端
      const chatroomClients = clients.get(password);
      if (chatroomClients) {
        chatroomClients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  // 监听客户端断开连接
  ws.on('close', () => {
    const chatroomClients = clients.get(password);
    if (chatroomClients) {
      chatroomClients.delete(ws);
      
      // 如果聊天室没有客户端了，移除该聊天室
      if (chatroomClients.size === 0) {
        clients.delete(password);
      }
    }
    
    console.log(`Client disconnected from chatroom ${password}`);
  });
});

// 引入路由
const chatroomRouter = require('./routes/chatroom');
const messageRouter = require('./routes/message');
const adminRouter = require('./routes/admin');

// 使用路由
app.use('/api/chatroom', chatroomRouter);
app.use('/api/messages', messageRouter);
app.use('/api/admin', adminRouter);

// 测试路由
app.get('/', (req, res) => {
  res.send('Chat-X Server is running');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});