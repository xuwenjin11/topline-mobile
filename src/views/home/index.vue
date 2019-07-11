<template>
    <div class="home-box">
        <!-- 顶部搜索 -->
        <van-nav-bar class="home-warp" title="首页" fixed />
        <!-- <div class="home-warp" fixed>
            <van-search
            clearable
            shape="round"
            v-model="value"
            input-align="center"
            placeholder="搜索" />
        </div> -->
        <!-- 标签栏 -->
        <van-tabs class="channel-tabs" v-model="active">
            <van-tab
            :title="channelsItem.name"
            v-for="channelsItem in channels"
            :key="channelsItem.id">
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                v-model="loading"
                :finished="finished"
                sticky
                finished-text="没有更多了"
                @load="onLoad"
                >
                <van-cell
                    v-for="item in list"
                    :key="item"
                    :title="item"
                />
                </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
        <!-- 底部导航 -->
        <van-tabbar>
            <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
            <van-tabbar-item icon="comment-o" to="/">问答</van-tabbar-item>
            <van-tabbar-item icon="video-o" to="/">视频</van-tabbar-item>
            <van-tabbar-item icon="contact" to="/">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { getUserChannels } from '@/api/channel.js'
export default {
  name: 'HomeIndex',
  created () {
    this.loadChannels()
  },
  data () {
    return {
      value: '',
      active: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: []
    }
  },
  methods: {
    // 下拉滑动刷新
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        // this.count++
      }, 500)
    },
    // 获取用户频道数据信息
    async loadChannels () {
      try {
        // 判断用户是否登录
        const { user } = this.$store.state
        // 如果登录显示用户登录频道列表
        if (user) {
          this.channels = (await getUserChannels()).channels
        } else {
          // 如果没有登录，判断用户是否有本地存储数据，如果有数据将数据显示出来，如果没有获取频道列表
          const localChannels = window.localStorage.getItem('channels')
          // 如果有本地存储的频道列表，则使用本地的
          if (localChannels) {
            this.channels = localChannels
          } else {
            this.channels = (await getUserChannels()).channels
            console.log(this.channels)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-box{
    .home-warp{
        background-color: #3296fa;
        .van-nav-bar__title{
            color: #fff;
        }
        .van-search{
           background: #3296fa !important;
           .van-search__content{
               background: #5babfb;
           }
        }
    }
}
// 在底边设置宽度，来显示已经加载完毕所有数据的信息
.channel-tabs{
    margin-bottom: 100px;
}
// 给标签栏设置固定定位，当滚动下拉时标签和头部导航固定
// 使用/deep/深度选择器，进行选择标签，
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content{
  margin-top: 92px;
}
</style>
