<template>
  <div class="login-container">
    <el-card class="login-card" shadow="always">

      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="rules"
        class=""
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">注册</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="registerForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-form-item prop="password2">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType2"
            ref="password2"
            v-model="registerForm.password2"
            :type="passwordType2"
            placeholder="再次输入密码"
            name="password2"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd2">
            <svg-icon
              :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-form-item prop="name">
          <span class="svg-container">
            <i class="el-icon-user" />
          </span>
          <el-input
            ref="name"
            v-model="registerForm.name"
            placeholder="真实姓名"
            name="name"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="contact">
          <span class="svg-container">
            <!-- <svg-icon icon-class="phone" /> -->
            <i class="el-icon-phone" />
          </span>
          <el-input
            ref="contact"
            v-model="registerForm.contact"
            placeholder="联系方式"
            name="contact"
            type="text"
            tabindex="4"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item>
          <el-radio-group v-model="registerForm.type">
            <el-radio style="color: #c0c4cc; margin-left:15px" :label="1">云工厂管理员</el-radio>
            <el-radio style="color: #c0c4cc" :label="2">经销商</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="registerForm.type == 1">
          <el-form-item prop="fac_name">
            <span class="svg-container">
              <!-- <svg-icon icon-class="phone" /> -->
              <i class="el-icon-info" />
            </span>
            <el-input
              ref="fac_name"
              v-model="registerForm.fac_name"
              placeholder="工厂名称"
              name="fac_name"
              type="text"
              tabindex="4"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="fac_describe">
            <span class="svg-container">
              <i class="el-icon-info" />
            </span>
            <el-input
              ref="fac_describe"
              v-model="registerForm.fac_describe"
              placeholder="工厂描述"
              name="fac_describe"
              type="text"
              tabindex="4"
              auto-complete="on"
            />
          </el-form-item>
        </div>

        <div style="text-align: right">
          <el-link
            :loading="loading"
            type="primary"
            style="align: left"
            @click.native.prevent="handleBack"
          >点我返回登录</el-link>
        </div>
        <div>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom:5%; margin-top:5%"
            @click.native.prevent="handleRegister"
          >注册</el-button>
        </div>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { Message } from 'element-ui'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      callback()
    }
    var checkUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (value.length > 20) {
        callback(new Error('用户名过长'))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length > 20) {
        callback(new Error('密码过长'))
      } else {
        callback()
      }
    }
    var checkPassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value.length > 20) {
        callback(new Error('密码过长'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入真实姓名'))
      } else if (value.length > 20) {
        callback(new Error('真实姓名过长'))
      } else {
        callback()
      }
    }
    var checkContact = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系方式'))
      } else if (value.length > 20) {
        callback(new Error('联系方式过长'))
      } else {
        callback()
      }
    }
    var checkFacName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工厂名称'))
      } else if (value.length > 20) {
        callback(new Error('工厂名称过长'))
      } else {
        callback()
      }
    }
    var checkFacDescribe = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工厂描述'))
      } else if (value.length > 20) {
        callback(new Error('工厂描述过长'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        username: '',
        password: '',
        password2: '',
        name: '',
        contact: '',
        type: 1,
        fac_name: '',
        fac_describe: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      passwordType2: 'password',
      redirect: undefined,
      rules: {
        username: [{ validator: checkUsername, trigger: 'change' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        password2: [{ validator: checkPassword2, trigger: 'blur' }],
        name: [{ validator: checkName, trigger: 'change' }],
        contact: [{ validator: checkContact, trigger: 'change' }],
        fac_name: [{ validator: checkFacName, trigger: 'change' }],
        fac_describe: [{ validator: checkFacDescribe, trigger: 'change' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showPwd2() {
      if (this.passwordType2 === 'password') {
        this.passwordType2 = ''
      } else {
        this.passwordType2 = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password2.focus()
      })
    },
    handleBack() {
      this.$router.push({ path: '/login' })
    },
    handleRegister() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          // var users = [
          //   { username: 'admin', password: 'admin', type: '超级管理员', userId: '1' },
          //   { username: '113', password: '12', type: '云工厂管理员', userId: '12' },
          //   { username: '11', password: '22', type: '经销商', userId: '13' }
          // ]
          // var flag = 0
          // for (let index = 0; index < users.length; index++) {
          //   const element = users[index]
          //   if (this.registerForm.username === element.username) {
          //     flag = 1
          //   }
          // }
          // if (flag === 1) {
          //   Message.error('用户名重复')
          // }
          this.$axios.post('/api/user/add', this.registerForm).then(r => {
            // console.log(r)
            if (r.data === -2) {
              Message.error('表单未填写完整')
            } else if (r.data === -1) {
              Message.error('用户名重复')
            } else if (r.data === 0) {
              this.$router.push({ path: this.redirect || '/login' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

      // this.$axios.post('/api/user/add', this.registerForm).then(r => {
      //   // console.log(r)
      //   if (r.data === -2) {
      //     Message.error('表单未填写完整')
      //   } else if (r.data === -1) {
      //     Message.error('用户名重复')
      //   } else if (r.data === 0) {
      //     this.$router.push({ path: this.redirect || '/login' })
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #575656;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #4e4d4d inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg: #2f3031;
$bg: #383838;
$bg_light: #575656;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display:flex;
  justify-content:center; //水平居中
  align-items:center; //垂直居中

  .login-card {
    border-color: $bg_light;
    background-color: $bg_light;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 10px 10px 0;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
