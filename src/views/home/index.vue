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
            <van-tab title="推荐">
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
            <van-tab title="热门话题">内容 2</van-tab>
            <van-tab title="科技动态">内容 3</van-tab>
            <van-tab title="区块链">内容 4</van-tab>
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
export default {
  name: 'HomeIndex',
  data () {
    return {
      value: '',
      active: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false
    }
  },
  methods: {
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
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        // this.count++
      }, 500)
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
