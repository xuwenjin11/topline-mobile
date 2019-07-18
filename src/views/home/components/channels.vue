<template>
    <div>
        <van-popup
          :value="value"
          @input="$emit('input', $event)"
          position="bottom"
          :style="{ height: '95%' }"
        >
      <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
            @click="isEdit=!isEdit"
          >{{ isEdit? '完成':'编辑' }}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          @click="handleUserChannelClick(item,index)"
          >
          <span
          class="text"
          :class="{ active: index=== activeIndex}"
          >
          {{ item.name }}
          </span>
          <van-icon class="close-icon" name="close" v-show="isEdit" />
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          @click="handelAddChannels(item)"
          >
          <div class="info">
            <span class="text">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
        </van-popup>
    </div>
</template>

<script>
import {
  getAllChannels,
  deleteUserChannel,
  updateUserChannel
}
  from '@/api/channel'
export default {
  name: 'HomeChannels',
  created () {
    this.loadAllChannels()
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    //  将已经存在的频道数据过滤出去
    recommendChannels () {
    // 获取已经存在的频道id
      const delseFilter = this.userChannels.map(item => item.id)
      // 将已经存在的频道过滤出去，获取剩余频道数据
      return this.allChannels.filter(item => !delseFilter.includes(item.id))
    }
  },
  methods: {
    //  获取所有频道列表
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        // console.log(data)
        // 将获取到的数据处理为我们需要的格式
        data.channels.forEach(item => {
          item.articles = []
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.allChannels = data.channels
      } catch (err) {
        console.log(err)
      }
    },
    // 添加频道
    async handelAddChannels (item) {
      // userChannels 是 props 数据
      // props 数据有个原则：单向数据流
      // 数据只受父组件影响，但是反之不会
      // 但是引用类型除外
      // 即便是这样：也最好不要利用这个特点
      // 建议做法就是将数据传递给父组件，让组件自己去修改
      //  this.userChannels.push(item)
      // 截取一个新的数组，操作这个数组，操作结束将结果传递给父组件，让父组件自己去修改
      // 始终记住一个原则：Props 数据是单向的，不要在子组件中修改它，始终由父组件去修改从而影响它
      const channels = this.userChannels.slice(0)
      channels.push(item)
      this.$emit('update:user-channels', channels)
      const { user } = this.$store.state
      //  判断是否已经登录如果已经登录，发送请求获取用户频道数据
      if (user) {
        // 对于频道数据中，推荐是不变的
        await updateUserChannel([{
          id: item.id,
          seq: channels.length - 1 // 序号
        }])
        // console.log(this.$store.state)
      } else {
        // 如果没有登录，则添加到本地存储
        // 没有就创建，有的直接覆盖
        // 注意：本地存储数据无法像 js 数据变量去修改，要想改变只能完全重写
        window.localStorage.setItem('channels', JSON.stringify(channels))
      }
    },
    // 点击频道列表，当处于频道列表编辑时，点击频道时就跳转到tab频道列表
    // 当处于完成时点击删除频道数据
    async handleUserChannelClick (item, index) {
      // 如果是非编辑状态，切换到编辑状态
      if (!this.isEdit) {
        // 将点击的频道传递给父组件
        this.$emit('update:active-index', index)
        // v-model相当于
        // :value="isChannelShow"
        // @input="isChannelShow = $event"
        // 关闭频道组件，传递给父组件
        this.$emit('input', false)
        return
      }
      // 如果用户没有登录
      const channels = this.userChannels.slice(0)
      channels.splice(index, 1)
      this.$emit('update:user-channels', channels)
      // 如果用户已经登录,对频道数据进行删除
      const { user } = this.$store.state
      if (user) {
        await deleteUserChannel(item.id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    // .action {}
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
