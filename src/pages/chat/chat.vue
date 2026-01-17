<template>
  <view class="chat-container">
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-into-view="scrollToView"
      scroll-with-animation
    >
      <view 
        v-for="(message, index) in messages" 
        :key="index"
        :id="'message-' + index"
        :class="['message-item', message.isSelf ? 'self' : 'other']"
      >
        <view class="message-content">
          <view class="message-nickname">{{ message.nickname }}</view>
          <view class="message-text">{{ message.content }}</view>
          <view class="message-time">{{ message.time }}</view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 昵称设置弹窗 -->
    <view class="nickname-modal" v-if="showNicknameModal">
      <view class="modal-content">
        <view class="modal-title">设置昵称</view>
        <input 
          v-model="nickname" 
          type="text" 
          placeholder="请输入您的昵称"
          class="nickname-input"
          @confirm="confirmNickname"
        />
        <button class="confirm-button" @click="confirmNickname">确认</button>
      </view>
    </view>
    
    <!-- 消息输入区域 -->
    <view class="input-area">
      <input 
        v-model="inputMessage" 
        type="text" 
        placeholder="请输入消息..."
        placeholder-class="placeholder"
        class="message-input"
        @confirm="sendMessage"
      />
      <button class="send-button" @click="sendMessage" :disabled="!nickname || !inputMessage.trim()">
        发送
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      messages: [],
      inputMessage: '',
      nickname: '',
      chatroomPassword: '',
      showNicknameModal: false,
      scrollToView: '',
      socketTask: null
    }
  },
  onLoad() {
    // 获取聊天室口令
    this.chatroomPassword = uni.getStorageSync('chatroomPassword')
    
    // 获取保存的昵称
    this.nickname = uni.getStorageSync('nickname')
    
    // 如果没有昵称，显示设置昵称弹窗
    if (!this.nickname) {
      this.showNicknameModal = true
    }
    
    // 加载历史消息
    this.loadHistoryMessages()
    
    // 连接WebSocket（如果需要实时通信）
    this.connectWebSocket()
  },
  onUnload() {
    // 关闭WebSocket连接
    if (this.socketTask) {
      this.socketTask.close()
    }
  },
  onNavigationBarButtonTap() {
    // 点击右上角设置图标，跳转到设置页面
    uni.navigateTo({
      url: '/pages/settings/settings'
    })
  },
  methods: {
    async loadHistoryMessages() {
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        const response = await uni.request({
          url: `${SERVER_URL}/api/messages/history`,
          method: 'POST',
          data: {
            password: this.chatroomPassword
          }
        })
        
        if (response.data.success) {
          this.messages = response.data.messages
          this.scrollToBottom()
        }
      } catch (error) {
        console.error('加载历史消息失败:', error)
      }
    },
    
    connectWebSocket() {
      // WebSocket连接逻辑（如果需要实时通信）
      // 打包前需要修改为实际的WebSocket地址
      const WS_URL = 'ws://your-server-domain:3000' // 请在此处修改WebSocket地址
      
      this.socketTask = uni.connectSocket({
        url: `${WS_URL}/ws?password=${this.chatroomPassword}`,
        success() {
          console.log('WebSocket连接成功')
        }
      })
      
      this.socketTask.onMessage((res) => {
        const message = JSON.parse(res.data)
        this.messages.push(message)
        this.scrollToBottom()
      })
    },
    
    confirmNickname() {
      if (!this.nickname.trim()) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        })
        return
      }
      
      // 保存昵称到本地
      uni.setStorageSync('nickname', this.nickname)
      this.showNicknameModal = false
    },
    
    async sendMessage() {
      if (!this.inputMessage.trim()) return
      
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      const message = {
        content: this.inputMessage.trim(),
        nickname: this.nickname,
        time: new Date().toLocaleTimeString(),
        isSelf: true
      }
      
      // 先添加到本地消息列表
      this.messages.push(message)
      this.inputMessage = ''
      this.scrollToBottom()
      
      try {
        // 发送消息到服务器
        await uni.request({
          url: `${SERVER_URL}/api/messages/send`,
          method: 'POST',
          data: {
            password: this.chatroomPassword,
            nickname: this.nickname,
            content: message.content
          }
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        })
      }
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const lastIndex = this.messages.length - 1
        if (lastIndex >= 0) {
          this.scrollToView = 'message-' + lastIndex
        }
      })
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 30rpx;
  display: flex;
}

.message-item.self {
  justify-content: flex-end;
}

.message-item.other {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 15rpx 20rpx;
  border-radius: 18rpx;
  position: relative;
}

.message-item.self .message-content {
  background-color: #07c160;
  color: #fff;
}

.message-item.other .message-content {
  background-color: #fff;
  color: #333;
  border: 1rpx solid #e6e6e6;
}

.message-nickname {
  font-size: 24rpx;
  margin-bottom: 5rpx;
  opacity: 0.8;
}

.message-text {
  font-size: 32rpx;
  line-height: 1.4;
  word-break: break-word;
}

.message-time {
  font-size: 20rpx;
  margin-top: 5rpx;
  text-align: right;
  opacity: 0.7;
}

.nickname-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 12rpx;
  width: 80%;
  max-width: 500rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.nickname-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.confirm-button {
  width: 100%;
  height: 80rpx;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: #fafafa;
  border-top: 1rpx solid #e6e6e6;
}

.message-input {
  flex: 1;
  height: 80rpx;
  background-color: #fff;
  border: 1rpx solid #dcdfe6;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  margin-right: 20rpx;
}

.send-button {
  width: 120rpx;
  height: 80rpx;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.send-button:disabled {
  background-color: #c0c4cc;
}

.placeholder {
  color: #909399;
}
</style>