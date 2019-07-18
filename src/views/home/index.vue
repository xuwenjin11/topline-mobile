<template>
    <div class="home-box">
        <!-- 顶部搜索 -->
        <div class="home-warp">
            <van-search
            class="home-search"
            clearable
            shape="round"
            v-model="value"
            show-action
            input-align="center"
            placeholder="请输入搜索内容"
            @click="$router.push({name: 'search'})"
             />
        </div>
        <!-- 标签栏 -->
        <van-tabs class="channel-tabs" v-model="activeChannelIndex">
            <div slot="nav-right" class="wap-nav" @click="isShowChannels=true">
              <van-icon name="wap-nav" class="wap-icon"/>
            </div>
            <van-tab
            v-for="channelsItem in channels"
            :key="channelsItem.id"
            :title="channelsItem.name"
            >
                <van-pull-refresh
                v-model="channelsItem.downPullLoading"
                @refresh="onRefresh"
                :success-text="channelsItem.downPullSuccessText"
                :success-duration="1000"
                >
                <van-list
                v-model="channelsItem.upPullLoading"
                :finished="channelsItem.upPullFinished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <van-cell-group>
                  <van-cell
                  v-for="articleItem in channelsItem.articles"
                  :key="articleItem.art_id.toString()"
                  :title="articleItem.title"
                  >
                  <div slot="label">
                    <template>
                      <van-grid :border="false" :column-num="3">
                        <van-grid-item
                        v-for="(img, index) in articleItem.cover.images"
                        :key="index">
                          <van-image :src="img" lazy-load/>
                        </van-grid-item>
                      </van-grid>
                    </template>
                    <p>
                      <span>{{ articleItem.aut_name }}</span>
                      &nbsp;
                      <span>{{ articleItem.comm_count }}评论</span>
                      &nbsp;
                      <span>{{ articleItem.pubdate | relativeTime}}</span>
                      <van-icon class="close" name="close" @click="handleShowMoreAction(articleItem)"/>
                    </p>
                  </div>
                  </van-cell>
                </van-cell-group>
                <van-cell
                v-for="articleItem in channelsItem.articles"
                :key="articleItem.art_id.toString()"
                :title="articleItem.title"
                />
                </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
        <van-dialog
        v-model="isShowInfo"
        :showConfirmButton="false"
        closeOnClickOverlay
        :before-close="handleMoreActionClose"
        >
        <van-cell-group v-if="!toggleRubbish">
          <van-cell title="不感兴趣" icon="close" @click="handleDislick"/>
          <van-cell title="反馈垃圾内容"  @click="toggleRubbish=true" is-link icon="warning-o"/>
          <van-cell title="屏蔽" icon="underway-o" @click="handleAddBlacklist" />
          <van-cell title="为什么看到此广告" icon="info-o"/>
        </van-cell-group>
        <van-cell-group v-else>
          <van-cell icon="arrow-left" @click="toggleRubbish=false"/>
          <van-cell
          v-for="item in reportsContents"
          :key="item.value"
          :title="item.label"
          @click="handleReportArticle(item.value)"
          />
        </van-cell-group>
        </van-dialog>
         <!--
          :value="isChannelShow"
          @input="isChannelShow = $event"
          .sync 修饰符会自动监听一个事件：
          @update:user-channels="channels = $event"
          简单来说，给 props 数组加 .sync 其实就是 v-model 的作用
          只不过一个组件只能有一个 v-model
        -->
        <home-channels
        v-model="isShowChannels"
        :user-channels.sync="channels"
        :active-index.sync="activeChannelIndex"
        />
    </div>
</template>

<script>
import { getUserChannels } from '@/api/channel.js'
import { userBlock } from '@/api/user.js'
import {
  getArticles,
  dislikeArticle,
  reportArticle
} from '@/api/article.js'
import HomeChannels from './components/channels'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannels
  },
  created () {
    this.loadChannels()
    // this.loadArticles()
  },
  // 监听用户是否登录
  watch: {
    // 监视用户user状态
    // 由于使用路由缓存，所以对用户登录状态进行监视，
    // 如果用户登录了，则加载用户频道列表
    async '$store.state.user' () {
      await this.loadChannels()
      // 频道数据发生改变，重新激活当前频道数据
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为 true，它就会自动去调用 onLoad 请求函数
      this.activeChannel.upPullLoading = true
    }
  },
  data () {
    return {
      value: '',
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [], // 频道数据
      isShowChannels: false,
      isShowInfo: false,
      toggleRubbish: false,
      currentArticle: null, // 存储需要的文章数据
      reportsContents: [
        { label: '其他问题', value: 1 },
        { label: '标题夸张', value: 2 },
        { label: '低俗色情', value: 3 },
        { label: '错别字多', value: 4 },
        { label: '旧闻重复', value: 5 },
        { label: '广告软文', value: 6 },
        { label: '内容不实', value: 7 },
        { label: '涉嫌违法犯罪', value: 8 },
        { label: '侵权', value: 0 }
      ]
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  methods: {
    // 获取用户频道数据信息
    async loadChannels () {
      try {
        // 判断用户是否登录,判断是否有token
        const { user } = this.$store.state
        let channels = []
        // 如果登录显示用户登录频道列表
        if (user) {
          const data = await getUserChannels()
          channels = data.channels
        } else {
          // 如果没有登录，判断用户是否有本地存储数据，如果有数据将数据显示出来，如果没有获取频道列表
          const localChannels = JSON.parse(window.localStorage.getItem('channels'))
          // 如果有本地存储的频道列表，则使用本地的
          if (localChannels) {
            channels = localChannels
          } else {
            // 如果本地存储没有数据，发送请求进行获取数据
            const data = await getUserChannels()
            channels = data.channels
          }
        }
        // 对channels进行数据获取，遍历，存储以后可能使用到的数据
        channels.forEach(item => {
          item.articles = [] // 来存储文章列表数据
          item.timestamp = Date.now() // 存储控制下一页数据时间戳
          item.downPullLoading = false // 控制下拉刷新状态
          item.upPullLoading = false // 控制上拉刷新状态
          item.upLoadingSuccess = false // 控制加载完成成功的状态
        })
        // 将存储好的数据信息赋值给channels
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },
    // 下拉滑动刷新
    async onLoad () {
      await this.$sleep(800)
      // 定义一个data数组
      let data = []
      // 将获取到的数据赋值给data
      data = await this.loadArticles()
      // 如果数据时间戳和数据都没有，阻止向下执行，关闭上拉，下拉状态按钮
      if (!data.pre_timestamp && !data.results.length) {
        // 加载完成后对数据显示数据加载完成
        this.activeChannel.upLoadingSuccess = true
        // 关闭加载上拉刷新，阻止继续onLoad
        this.activeChannel.upPullLoading = false
        // console.log(this.activeChannel.upLoadingSuccess)
        // console.log(this.activeChannel.upPullLoading)
        return
      }
      // 判断数据没有更新数据并且没有数据
      // 如果数据时间戳是没有最新更新，并且数据results数据是空
      if (data.pre_timestamp && !data.results.length) {
        // 将上次更新数据时间戳赋值给频道数据时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        // 重新加载数据
        data = await this.loadArticles()
      }
      // 将时间戳进行赋值
      this.activeChannel.timestamp = data.pre_timestamp
      // 添加获取数据的结果数据，进行push添加
      this.activeChannel.articles.push(...data.results)
      // 关闭上拉刷新状态
      this.activeChannel.upPullLoading = false
    },
    // 下拉刷新
    async onRefresh () {
      // 将this存储起来
      const { activeChannel } = this
      // 将时间戳存储起来
      const timestamp = activeChannel.timestamp
      // 赋值最新时间戳
      activeChannel.timestamp = Date.now()
      // 发送请求，获取数据
      const data = await this.loadArticles()
      // 判断如果有新的数据
      if (data.results.length) {
        // 将获取到的新数据添加到文章列表中
        activeChannel.articles = data.results
        // 最新时间为获取数据的最新时间
        activeChannel.timestamp = data.pre_timestamp
        // 获取最新时间后将更新成功数据提示显示出来
        activeChannel.downPullSuccessText = '更新数据成功'
        // 重新加载onload
        this.onLoad()
      } else {
        // 如果没有数据更新,提示已是最新数据
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 关闭下拉刷新数据
      activeChannel.downPullLoading = false
      // 没有数据更新，将过去下一页时间戳赋值给最新时间戳
      activeChannel.timestamp = timestamp
    },
    // 获取文章数据
    async loadArticles () {
      // 将获取到的频道id进行获取
      const { id: channelId, timestamp } = this.activeChannel
      // console.log(this.activeChannel)
      const data = await getArticles({
        channelId,
        timestamp,
        withTop: 1
      })
      // console.log(data)
      return data
    },
    // 获取频道列表页
    handleIcon () {
      this.showIcon = true
    },
    handleShowMoreAction (item) {
      this.currentArticle = item
      this.isShowInfo = true
    },
    // 对不喜欢文章进行处理
    async handleDislick () {
      // 将文章id转为字符串
      const articleId = this.currentArticle.art_id.toString()
      await dislikeArticle(articleId)
      // console.log(data)
      // 关闭对话框
      this.isShowInfo = false
      // 获取文章
      const article = this.activeChannel.articles
      const artIndex = article.findIndex(item => item.art_id.toString() === articleId)
      // 将本条数据移除
      article.splice(artIndex, 1)
      this.$toast('操作成功')
    },
    // 拉黑屏蔽用户
    async handleAddBlacklist () {
      await userBlock(this.currentArticle.aut_id)
      // 关闭对话框
      this.isShowInfo = false
      this.$toast('操作成功')
    },
    // 举报文章
    async handleReportArticle (type) {
      try {
        await reportArticle({
          articleId: this.currentArticle.aut_id.toString(),
          type,
          remark: ''
        })
        // 将对话框关闭
        this.isShowInfo = false
        // 判断返回的状态码进行不同提示
        this.$toast('举报成功')
        // console.log(data)
      } catch (err) {
        if (err.response.status === 409) {
          this.$toast('该文章已经被举报过了')
        }
        // this.isShowInfo = false
        // console.log(err)
      }
    },
    handleMoreActionClose (action, done) {
      // 瞬间关闭
      done()
      // 然后将里面的面板切换为初始状态
      window.setTimeout(() => {
        this.toggleRubbish = false
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.home-box{
    .home-warp{
      width: 100%;
      position: fixed;
      z-index: 1000;
      top: 0;
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
.channel-tabs /deep/ .wap-nav{
  position: fixed;
  right: 0;
  top: 8%;
  background-color: #fff;
}
.channel-tabs /deep/ .wap-icon{
  font-size: 100%;
}
.channel-tabs .close{
  float: right;
  font-size: 30px;
}
</style>
