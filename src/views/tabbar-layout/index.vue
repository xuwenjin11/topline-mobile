<template>
    <div class="tabbar-layout">
      <keep-alive>
        <router-view />
      </keep-alive>
       <!-- 底部导航 -->
        <van-tabbar router>
            <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
            <van-tabbar-item icon="comment-o" to="/">问答</van-tabbar-item>
            <van-tabbar-item icon="video-o" to="/">视频</van-tabbar-item>
            <van-tabbar-item icon="contact" to="/">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'TabbarLayout'
}
</script>

<style lang="less" scoped>
</style>
