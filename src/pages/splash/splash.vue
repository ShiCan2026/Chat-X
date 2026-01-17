<template>
  <view class="splash-container">
    <view class="logo">
      <text class="logo-text">Chat-X</text>
    </view>
    <view class="slogan">
      <text>简单、高效的聊天工具</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Splash',
  data() {
    return {
      timer: null
    }
  },
  onLoad() {
    // 启动页停留2秒后跳转到聊天室口令页面
    this.timer = setTimeout(() => {
      uni.navigateTo({
        url: '/pages/chat-password/chat-password'
      })
    }, 2000)
  },
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>
.splash-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #323233;
}

.logo {
  margin-bottom: 40rpx;
}

.logo-text {
  font-size: 80rpx;
  font-weight: bold;
  color: #ffffff;
}

.slogan {
  text-align: center;
}

.slogan text {
  font-size: 32rpx;
  color: #cccccc;
}
</style>