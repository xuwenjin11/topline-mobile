<template>
     <div class="search-box">
        <!-- 顶部搜索 -->
        <div class="search-warp">
            <van-icon name="arrow-left" class="arrow-left" @click="$router.back()"/>
            <form action="/">
            <van-search
            class="search-nav"
            clearable
            shape="round"
            v-model="searchContent"
            show-action
            placeholder="请输入搜索内容"
            @search="handleSearch(searchContent)"
             />
            </form>
             <!-- 搜索联想 -->
            <van-cell-group  v-if="searchText.length">
            <van-cell
            icon="search"
            v-for="item in searchText"
            :key="item"
            @click="handleSearch(item)"
            >
            <!-- 显示搜索结果高亮 -->
            <div slot="title" v-html="heightLight(item, searchContent)"></div>
            </van-cell>
            </van-cell-group>
            <!-- 历史记录 -->
            <van-cell-group v-else>
            <van-cell title="历史记录">
                <van-icon
                v-if="!isDeleteShow"
                slot="right-icon"
                name="delete"
                style="line-height: inherit;"
                @click="isDeleteShow=true"
                />
                <div v-else>
                  <span @click="serachHistories=[]">全部删除</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                  <span @click="isDeleteShow=false">完成</span>
                </div>
                </van-cell>
                <van-cell
                v-for="(item,index) in serachHistories"
                :key="item"
                :title="item"
                >
               <van-icon
                  v-show="isDeleteShow"
                  slot="right-icon"
                  name="close"
                  style="line-height: inherit;"
                  @click="serachHistories.splice(index, 1)"
                />
            </van-cell>
            </van-cell-group>
    <!-- /历史记录 -->
        </div>
     </div>
</template>

<script>
import { userSearch } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'search',
  data () {
    return {
      searchContent: '', // 搜索v-model绑定的数据
      searchText: [],
      isDeleteShow: false,
      serachHistories: JSON.parse(window.localStorage.getItem('serach-histories'))
    }
  },
  watch: {
    // 在实时搜索的功能中，会造成输入一个发送一次请求，太过于频繁，
    // 函数防抖，就是解决发送多次请求，等待一段时间发送请求，减少发送请求次数，缓解服务器压力
    // 使用第三方函数库进行，函数防抖
    // 在监听器中对搜索内容绑定，进行实时监听
    searchContent: debounce(async function (newVal) {
      // 去除空格
      newVal = newVal.trim()
      const data = await userSearch(newVal)
      this.searchText = data.options
    }, 500),
    serachHistories: {
      // 在监听属性里面进行对历史记录进行实时监听
      handler () {
        window.localStorage.setItem('serach-histories', JSON.stringify([...new Set(this.serachHistories)]))
      },
      deep: true // 建议引用类型数据都配置为深度监视
    }
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    // 处理搜索内容高亮
    heightLight (text, keyword) {
      return text.toLowerCase().split(keyword).join(`<span style="color: red">${keyword}</span>`)
    },
    // 跳转到搜索结果页面
    handleSearch (q) {
      // console.log(q)
      if (!q.length) {
        return
      }
      // 对于历史数据进行数组去重操作，使用new Set()方法
      // window.localStorage.setItem(
      //   'serach-histories',
      //   JSON.stringify([...new Set(this.serachHistories)])
      // )
      this.serachHistories.unshift(q)
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-box{
    .arrow-left{
        float: left;
        padding-top: 22px;
        padding-left: 10px;
    }
    .search-nav{
        background-color: skyblue;
    }
}
</style>
