<template>
  <view class="password-container">
    <view class="title">
      <text>请输入聊天室口令</text>
    </view>
    <view class="input-wrapper">
      <input 
        v-model="password" 
        type="text" 
        placeholder="输入聊天室口令" 
        placeholder-class="placeholder"
        class="password-input"
        @confirm="joinChatRoom"
      />
    </view>
    <view class="button-wrapper">
      <button class="join-button" @click="joinChatRoom">
        进入聊天室
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatPassword',
  data() {
    return {
      password: ''
    }
  },
  methods: {
    async joinChatRoom() {
      if (!this.password.trim()) {
        uni.showToast({
          title: '请输入聊天室口令',
          icon: 'none'
        })
        return
      }
      
      // 打包前需要修改为实际的服务器域名
      const SERVER_URL = 'http://your-server-domain:3000' // 请在此处修改服务器地址
      
      try {
        // 检查聊天室是否存在
        const response = await uni.request({
          url: `${SERVER_URL}/api/chatroom/check`,
          method: 'POST',
          data: {
            password: this.password
          }
        })
        
        if (response.data.success) {
          // 保存聊天室口令到本地
          uni.setStorageSync('chatroomPassword', this.password)
          
          // 跳转到聊天室页面
          uni.navigateTo({
            url: '/pages/chat/chat'
          })
        } else {
          uni.showToast({
            title: response.data.message,
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加入聊天室失败:', error)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.password-container {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 80rpx;
  color: #333;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 60rpx;
}

.password-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  background-color: #fff;
}

.placeholder {
  color: #909399;
}

.button-wrapper {
  width: 100%;
}

.join-button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #409eff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 8rpx;
  border: none;
}
</style>