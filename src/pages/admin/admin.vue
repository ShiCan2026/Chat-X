<template>
  <view class="admin-container">
    <!-- 密码验证 -->
    <view class="password-container" v-if="!isAuthenticated">
      <view class="title">管理员登录</view>
      <input 
        v-model="adminPassword" 
        type="password" 
        placeholder="请输入管理员密码"
        placeholder-class="placeholder"
        class="password-input"
        @confirm="login"
      />
      <button class="login-button" @click="login">登录</button>
    </view>
    
    <!-- 管理员功能区 -->
    <view class="admin-panel" v-else>
      <!-- 修改密码 -->
      <view class="setting-group">
        <view class="setting-title">密码管理</view>
        <view class="setting-item">
          <input 
            v-model="newPassword" 
            type="password" 
            placeholder="新密码"
            placeholder-class="placeholder"
            class="admin-input"
          />
          <button class="change-password-button" @click="changePassword" :disabled="!newPassword.trim()">
            修改密码
          </button>
        </view>
      </view>
      
      <!-- 聊天室列表 -->
      <view class="setting-group">
        <view class="setting-title">聊天室管理</view>
        <view 
          v-for="(room, index) in chatrooms" 
          :key="index"
          class="chatroom-item"
          @longpress="showRoomOptions(room, index)"
        >
          <view class="chatroom-info">
            <view class="chatroom-password">口令: {{ room.password }}</view>
            <view class="chatroom-messages">消息数: {{ room.messageCount }}</view>
          </view>
          <view class="chatroom-actions">
            <button class="action-button view" @click="viewMessages(room)">查看消息</button>
          </view>
        </view>
      </view>
      
      <!-- 消息列表 -->
      <view class="message-management" v-if="selectedRoom">
        <view class="setting-title">{{ selectedRoom.password }} 的消息</view>
        <view 
          v-for="(message, index) in selectedMessages" 
          :key="index"
          class="message-item"
          @longpress="deleteMessage(selectedRoom, index)"
        >
          <view class="message-header">
            <span class="message-nickname">{{ message.nickname }}</span>
            <span class="message-time">{{ message.time }}</span>
          </view>
          <view class="message-content">{{ message.content }}</view>
        </view>
        <button class="back-button" @click="selectedRoom = null">返回</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      isAuthenticated: false,
      adminPassword: '',
      newPassword: '',
      chatrooms: [],
      selectedRoom: null,
      selectedMessages: []
    }
  },
  onLoad() {
    // 初始化管理员登录状态
    this.isAuthenticated = false
  },
  methods: {
    async login() {
      if (!this.adminPassword) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return
      }
      
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/login`,
          method: 'POST',
          data: {
            password: this.adminPassword
          }
        })
        
        if (response.data.success) {
          this.isAuthenticated = true
          this.loadChatrooms()
        } else {
          uni.showToast({
            title: '密码错误',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    
    async changePassword() {
      if (!this.newPassword.trim()) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        })
        return
      }
      
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/change-password`,
          method: 'POST',
          data: {
            newPassword: this.newPassword
          }
        })
        
        if (response.data.success) {
          uni.showToast({
            title: '密码修改成功',
            icon: 'success'
          })
          this.newPassword = ''
        } else {
          uni.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    
    async loadChatrooms() {
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/chatrooms`,
          method: 'GET'
        })
        
        if (response.data.success) {
          this.chatrooms = response.data.chatrooms
        }
      } catch (error) {
        console.error('加载聊天室列表失败:', error)
      }
    },
    
    async viewMessages(room) {
      this.selectedRoom = room
      
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/messages`,
          method: 'POST',
          data: {
            password: room.password
          }
        })
        
        if (response.data.success) {
          this.selectedMessages = response.data.messages
        }
      } catch (error) {
        console.error('加载消息失败:', error)
      }
    },
    
    showRoomOptions(room, index) {
      uni.showActionSheet({
        itemList: ['删除聊天室'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.deleteChatroom(room, index)
          }
        }
      })
    },
    
    async deleteChatroom(room, index) {
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/delete-chatroom`,
          method: 'POST',
          data: {
            password: room.password
          }
        })
        
        if (response.data.success) {
          this.chatrooms.splice(index, 1)
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('删除聊天室失败:', error)
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    },
    
    async deleteMessage(room, messageIndex) {
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/admin/delete-message`,
          method: 'POST',
          data: {
            password: room.password,
            messageIndex: messageIndex
          }
        })
        
        if (response.data.success) {
          this.selectedMessages.splice(messageIndex, 1)
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('删除消息失败:', error)
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
}

.password-container {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
}

.password-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  margin-bottom: 40rpx;
}

.login-button {
  width: 100%;
  height: 88rpx;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.admin-panel {
  padding: 20rpx;
}

.setting-group {
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.setting-title {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #909399;
  background-color: #fafafa;
}

.setting-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.admin-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.change-password-button {
  width: 100%;
  height: 88rpx;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.change-password-button:disabled {
  background-color: #c0c4cc;
}

.chatroom-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.chatroom-item:last-child {
  border-bottom: none;
}

.chatroom-info {
  flex: 1;
}

.chatroom-password {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.chatroom-messages {
  font-size: 24rpx;
  color: #909399;
}

.action-button {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: none;
  color: #fff;
}

.action-button.view {
  background-color: #409eff;
}

.message-management {
  margin-top: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.message-item {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.message-item:last-child {
  border-bottom: none;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.message-nickname {
  font-weight: bold;
}

.message-time {
  font-size: 24rpx;
  color: #909399;
}

.message-content {
  font-size: 30rpx;
}

.back-button {
  width: 100%;
  height: 88rpx;
  background-color: #67c23a;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 30rpx;
}

.placeholder {
  color: #909399;
}
</style>