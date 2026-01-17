<template>
  <view :class="['app-container', currentTheme]">
    <router-view />
  </view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentTheme: uni.getStorageSync('theme') || 'light'
    }
  },
  onLaunch() {
    // 应用启动时的初始化逻辑
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  methods: {
    updateTheme(theme) {
      this.currentTheme = theme
      uni.setStorageSync('theme', theme)
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

/* 主题样式 */
.light {
  background-color: #ffffff;
  color: #333333;
}

.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.pink {
  background-color: #fff0f5;
  color: #333333;
}

.blue {
  background-color: #e6f7ff;
  color: #333333;
}
</style>