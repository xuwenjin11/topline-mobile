<template>
    <div class="login-box">
        <!-- 头部导航 -->
        <div class="login-warp">
            <van-nav-bar title="登录" />
        </div>
        <!-- 表单 -->
        <form>
        <van-cell-group>
            <van-field
                v-model="user.mobile"
                clearable
                label="手机号"
                placeholder="请输入手机号"
                v-validate="'required'"
                name="mobile"
                :error-message="errors.first('mobile')"
            />
            <van-field
                v-model="user.code"
                type="password"
                label="密码"
                placeholder="请输入密码"
                v-validate="'required'"
                name="code"
                :error-message="errors.first('code')"
            />
        </van-cell-group>
        <!-- 在点击登录时，表单进行默认提交，在注册点击事件时加上prevent阻止默认提交 -->
        <div class="login-btn-box">
            <van-button
            class="login-btn"
            type="info"
            :loading="loginLoading"
            @click.prevent="loginHome"
            loading-text="加载中..."
            >登录</van-button>
        </div>
        </form>
    </div>
</template>

<script>
import { login } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  created () {
    this.configFormErrorMessages()
  },
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      loginLoading: false,
      MyErrors: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async loginHome () {
      try {
        // 调用javascript进行校验
        const valid = await this.$validator.validate()
        // 判断如果校验失败阻止后续代码执行
        if (!valid) {
          return
        }
        this.loginLoading = true
        const data = await login(this.user)
        // 将获取到的token获取，存储起来
        this.$store.commit('setUser', data)
        // 跳转到首页
        // window.location.href = '/'
        this.$router.push({
          name: 'home'
        })
        console.log(data)
      } catch (err) {
        // console.log(err)
        // this.$message.error('登录失败')
        this.$toast.fail('登录失败')
      }
      this.loginLoading = false
    },
    configFormErrorMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }
      // 进行中文语言校验提示配置
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar{
    background: #3296fa;
    .van-nav-bar__title{
        color: #fff;
        font-size: 32px;
    }
}
.login-btn-box{
    padding: 20px;
    .login-btn{
        width: 100%;
    }
}
</style>
