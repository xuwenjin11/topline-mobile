<template>
    <div class="authInfo">
        <div class="auth-info">
            <div class="base-info">
            <img class="avatar" src="http://toutiao.meiduo.site/FkTXjvBkdM-pE9gQSzFjXlE7cIbY" alt="">
            <div>
                <p>阳光新闻</p>
                <p>1小时前 阳光新闻官方账号</p>
            </div>
            </div>
            <div>
            <van-button
            :type="article.is_followed? 'default':'danger'"
            class="auth-btn"
            :loading="isShow"
            @click="handleFllow"
            >{{ article.is_followed? '已关注':'关注' }}</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { followUser, unFollowUser } from '@/api/user'
export default {
  name: 'AuthInfo',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  created () {
    // this.handleFllow()
  },
  methods: {
    async handleFllow () {
    //   console.log(this.article)
      this.isShow = true
      try {
        const id = this.article.aut_id
        if (this.article.is_followed) {
          await unFollowUser(id)
          //  console.log(data)
          this.article.is_followed = false
        } else {
          await followUser(id)
          // console.log(res)
          this.article.is_followed = true
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.auth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  .base-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
  .auth-btn{
    margin-left: 130px;
  }
}
</style>
