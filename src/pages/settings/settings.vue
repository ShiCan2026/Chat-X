<template>
  <view class="settings-container">
    <view class="setting-group">
      <view class="setting-title">外观设置</view>
      <view class="setting-item">
        <view class="setting-label">皮肤</view>
        <view class="skin-options">
          <view 
            v-for="theme in themes" 
            :key="theme.value"
            :class="['skin-option', { active: currentTheme === theme.value }]"
            :style="{ backgroundColor: theme.color }"
            @click="changeTheme(theme.value)"
          ></view>
        </view>
      </view>
    </view>
    
    <view class="setting-group">
      <view class="setting-title">关于</view>
      <view class="setting-item" @click="showAbout">
        <view class="setting-label">关于Chat-X</view>
        <view class="setting-arrow">></view>
      </view>
    </view>
    
    <view class="setting-group">
      <view class="setting-item" @click="exitChatRoom">
        <view class="setting-label exit">退出聊天室</view>
      </view>
    </view>
    
    <!-- 关于弹窗 -->
    <view class="about-modal" v-if="showAboutModal">
      <view class="modal-content">
        <view class="modal-title">关于Chat-X</view>
        <view class="app-info">
          <view class="app-version">版本号：1.0.0</view>
          <view class="app-copyright" @click="countAboutClicks">
            © 2024 Chat-X. All rights reserved.
          </view>
        </view>
        <button class="close-button" @click="showAboutModal = false">关闭</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      currentTheme: '',
      themes: [
        { value: 'light', name: '白色', color: '#ffffff' },
        { value: 'dark', name: '黑色', color: '#1a1a1a' },
        { value: 'pink', name: '粉色', color: '#fff0f5' },
        { value: 'blue', name: '蓝色', color: '#e6f7ff' }
      ],
      showAboutModal: false,
      aboutClickCount: 0,
      clickTimer: null
    }
  },
  onLoad() {
    // 获取当前主题
    this.currentTheme = uni.getStorageSync('theme') || 'light'
  },
  methods: {
    changeTheme(theme) {
      this.currentTheme = theme
      uni.setStorageSync('theme', theme)
      
      // 更新全局主题
      getApp().updateTheme(theme)
      
      uni.showToast({
        title: '主题已切换',
        icon: 'success'
      })
    },
    
    showAbout() {
      this.showAboutModal = true
    },
    
    countAboutClicks() {
      // 连点五次进入管理员入口
      this.aboutClickCount++
      
      // 重置点击计时器
      if (this.clickTimer) {
        clearTimeout(this.clickTimer)
      }
      
      this.clickTimer = setTimeout(() => {
        this.aboutClickCount = 0
      }, 3000)
      
      if (this.aboutClickCount === 5) {
        // 进入管理员页面
        this.showAboutModal = false
        this.aboutClickCount = 0
        
        uni.navigateTo({
          url: '/pages/admin/admin'
        })
      }
    },
    
    exitChatRoom() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出当前聊天室吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地缓存
            uni.removeStorageSync('chatroomPassword')
            
            // 跳转到聊天室口令页面
            uni.navigateTo({
              url: '/pages/chat-password/chat-password'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.settings-container {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 32rpx;
}

.setting-label.exit {
  color: #f56c6c;
}

.setting-arrow {
  font-size: 28rpx;
  color: #c0c4cc;
}

.skin-options {
  display: flex;
  gap: 20rpx;
}

.skin-option {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 3rpx solid #dcdfe6;
  transition: all 0.3s;
}

.skin-option.active {
  border-color: #409eff;
  transform: scale(1.2);
}

.about-modal {
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

.app-info {
  text-align: center;
  margin-bottom: 40rpx;
}

.app-version {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.app-copyright {
  font-size: 28rpx;
  color: #909399;
  cursor: pointer;
}

.close-button {
  width: 100%;
  height: 80rpx;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
}
</style>