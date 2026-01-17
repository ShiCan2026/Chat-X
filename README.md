# Chat-X 聊天应用

一个基于UniApp开发的跨平台聊天应用，支持多聊天室、皮肤切换、管理员管理等功能。

## 技术栈

### 前端
- UniApp (Vue 3)
- 微信小程序/H5等多端支持

### 后端
- Node.js + Express
- WebSocket (实时通信)
- SQLite (数据库)

## 项目结构

```
├── src/                      # 前端源码
│   ├── components/           # 公共组件
│   ├── pages/                # 页面
│   │   ├── splash/           # 启动页
│   │   ├── chat-password/    # 聊天室口令页面
│   │   ├── chat/             # 聊天室页面
│   │   ├── settings/         # 设置页面
│   │   └── admin/            # 管理员页面
│   ├── static/               # 静态资源
│   ├── App.vue               # 应用根组件
│   ├── main.js               # 应用入口
│   ├── manifest.json         # 应用配置
│   └── pages.json            # 页面配置
├── server/                   # 后端源码
│   ├── config/               # 配置文件
│   ├── models/               # 数据模型
│   ├── routes/               # 路由
│   ├── utils/                # 工具函数
│   ├── database.db           # SQLite数据库（自动生成）
│   ├── package.json          # 后端依赖
│   └── server.js             # 后端入口
└── package.json              # 前端依赖
```

## 安装与部署

### 前端安装

1. 确保已安装Node.js和HBuilderX
2. 打开HBuilderX，导入前端项目
3. 安装依赖：
   ```bash
   npm install
   ```

### 后端安装

1. 进入server目录：
   ```bash
   cd server
   ```
2. 安装依赖：
   ```bash
   npm install
   ```

### 配置修改

**重要：打包前需要修改服务器地址！**

在以下文件中修改服务器地址：

1. `src/pages/chat-password/chat-password.vue`
2. `src/pages/chat/chat.vue`
3. `src/pages/admin/admin.vue`

将 `http://your-server-domain:3000` 替换为实际的服务器域名或IP地址。

### 启动服务

1. 启动后端服务：
   ```bash
   cd server
   npm start
   ```
   或使用开发模式：
   ```bash
   npm run dev
   ```

2. 前端运行：
   - 使用HBuilderX运行到指定平台（微信小程序/H5等）

## 功能说明

### 用户功能

1. **启动页**：应用启动时显示，自动跳转到聊天室口令页面
2. **聊天室口令**：输入口令进入聊天室（不存在则自动创建）
3. **聊天室**：
   - 查看历史消息（最多100条）
   - 设置昵称
   - 发送和接收消息
4. **设置**：
   - 切换皮肤（白色/黑色/粉色/蓝色）
   - 查看关于信息
   - 退出聊天室

### 管理员功能

1. **进入方式**：在设置页面的"关于"选项连续点击5次
2. **登录**：输入管理员密码（初始密码：123456）
3. **功能**：
   - 修改管理员密码
   - 查看所有聊天室列表
   - 查看聊天室消息
   - 删除聊天室
   - 删除单条消息

## 数据库结构

### 管理员表 (admin)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键 |
| password | TEXT | 管理员密码 |

### 聊天室表 (chatrooms)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键 |
| password | TEXT | 聊天室口令 |
| createdAt | DATETIME | 创建时间 |

### 消息表 (messages)
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键 |
| chatroomId | INTEGER | 聊天室ID |
| nickname | TEXT | 发送者昵称 |
| content | TEXT | 消息内容 |
| createdAt | DATETIME | 发送时间 |

## 部署说明

### 本地部署

1. 安装Node.js环境
2. 克隆项目到本地
3. 安装前后端依赖
4. 修改服务器地址配置
5. 启动后端服务
6. 运行前端项目

### 服务器部署

1. 准备一台云服务器（推荐使用Linux系统）
2. 安装Node.js和SQLite
3. 上传项目文件到服务器
4. 安装依赖
5. 配置防火墙（开放3000端口）
6. 使用PM2等工具管理后端服务
7. 配置域名解析（可选）
8. 前端打包并部署到对应平台

## 注意事项

1. 请确保服务器地址配置正确，否则无法正常连接
2. 管理员密码建议及时修改，确保安全性
3. SQLite数据库适合小型应用，如需高并发可考虑更换为MySQL等数据库
4. 开发环境下可使用npm run dev启动后端，生产环境建议使用PM2管理

## 关于部署

关于如何部署本项目指引详见DEPLOYMENT_GUIDE.md


## 许可证

MIT License
