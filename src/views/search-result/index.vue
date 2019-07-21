<template>
    <div class="search-result">
      <!-- 顶部导航 -->
        <van-nav-bar
          title="搜索结果"
          left-text="返回"
          left-arrow
          fixed
          @click-left="onClickLeft"
        />
        <!-- 顶部导航结束 -->
        <!-- 内容列表 -->
        <van-list
          v-model="searchLoading"
          :finished="searchFinished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in searchList"
            :key="item.toString()"
            :title="item.title"
          />
        </van-list>
    </div>
</template>

<script>
import { searchResults } from '@/api/search'
export default {
  name: 'search-result',
  data () {
    return {
      searchList: [],
      searchLoading: false,
      searchFinished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  // 由于在组件中使用了keep-alive组件缓存，当/search/a跳转到/search/b时路由会进行缓存
  // watch可以监听路由的变化
  /**
 * 这里有两个缓存：
 * 组件缓存
 *  生命周期不会重走，页面的切换会销毁重建
 * 路由本身的缓存
 *  当你从 a 路径导航到 b 路径的时候
 *  由于 a 路径和 b 路径使用的都是同一个组件，那么此时默认给你路由缓存
 * 例如我从 /search/a 到 /saerch/b，重用了
 * 但是我从 /serach/xxx 到 /非search 没有缓存（前提是不是同一个组件）
 *  /serach 就销毁了
 */
  watch: {
    '$route' (to, from) {
      console.log('变化了')
    }
  },
  /***
   * 第一种方法
   对于路由进行缓存的解决办法是
   使用activated和dsactivated进行分别设置页面的显示和隐藏
   组件进行缓存：页面显示时
   */
  activated () {
    // this.searchLoading = true
    // this.onLoad()
  },
  // 组件进行缓存时：页面隐藏
  deactivated () {
    /**  将页面数据设为空
    this.searchList = []
    将页码设置为1
    this.page = 1
    */
    /*
   方法二
    如果觉得那样麻烦的话，也可以在组件缓存失活的时候，直接手动销毁这个组件
    下次进来则会重新创建这个组件
    说白了就是手动禁用了当前组件缓存
    */
    this.$destroy()
  },
  // async created() {
  //   const data = await searchResults({
  //      page: 1,
  //      q: this.$route.params.q
  //    })
  //    // console.log(data)
  //    // this.searchList = data.results
  // },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    // 获取搜索结果
    async onLoad () {
      // 延缓下拉速度
      this.$sleep(800)
      // 请求搜索数据
      const data = await this.handelSearch()
      // console.log(data)
      // 判断是否有数据
      // 如果没有数据
      if (!data.results.length) {
        // 关闭下拉状态
        this.searchLoading = false
        // 加载完成
        this.searchFinished = true
        // 停止向下执行
        return
      }
      // 如果存在数据
      // 将数据渲染push到数据里
      this.searchList.push(...data.results)
      //  将页码加加，上次push上去的数据页码进行加一，再次请求下一页
      this.page += 1
      // 加载状态结束
      this.searchLoading = false
    },
    handelSearch () {
      return searchResults({
        page: this.page,
        q: this.q,
        perPage: this.perPage
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-list{
  margin-top: 96px;
}
</style>
