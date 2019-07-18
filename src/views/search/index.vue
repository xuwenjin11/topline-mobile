<template>
     <div class="search-box">
        <!-- 顶部搜索 -->
        <div class="search-warp">
            <van-icon name="arrow-left" @click="$router.back()"/>
            <van-search
            class="search-nav"
            clearable
            shape="round"
            v-model="searchContent"
            show-action
            placeholder="请输入搜索内容"
             />
             <!-- 搜索联想 -->
            <van-cell-group v-if="searchContent != 0">
            <van-cell
            icon="search"
            v-for="item in searchText"
            :key="item"
            :title="item.toLowerCase()"
            />
            </van-cell-group>
            <!-- 历史记录 -->
            <van-cell-group v-else>
            <van-cell title="历史记录">
                <van-icon
                slot="right-icon"
                name="delete"
                style="line-height: inherit;"
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
      searchText: []
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
    }, 500)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.search-box{
    .van-icon{
        float: left;
        padding-top: 22px;
        padding-left: 10px;
    }
    .search-nav{
        background-color: skyblue;
    }
}
</style>
