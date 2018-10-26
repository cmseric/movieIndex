<template>
  <div class="container">
    <div>
      <movie-index-header></movie-index-header>
    </div>
    <div class="userMessage">
      <user-message></user-message>
    </div>
    <div>
      <div class="box">用户名：{{detail.username}}</div>
    </div>
    <div>
      <div class="box">邮箱：{{detail.userMail}}</div>
    </div>
    <div>
      <div class="box">电话：{{detail.userPhone}}</div>
    </div>
    <div>
      <div class="box">状态：{{userStatus}}</div>
    </div>
    <div>
      <button v-on:click="ShowChangeUserPassword()">修改密码</button>
    </div>
    <div v-show="showRePassword">
      <div class="box">
        <label>输入旧密码：</label>
        <input v-model="password" placeholder="旧密码">
      </div>
      <div class="box">
        <label>输入新密码：</label>
        <input v-model="repassword" placeholder="新密码">
      </div>
      <div class="box">
        <button v-on:click="ChangeUserPassword()">修改密码</button>
      </div>
    </div>
    <div style="padding-top: 10px;">
      <router-link to="/sendEmail">
        <button>发送站内信</button>
      </router-link>
    </div>
    <div>
      <button @click="logout">登出</button>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import UserMessage from '../components/UserMessage'

export default {
  data () {
    return {
      items: [],
      detail: [],
      userStatus: '',
      showRePassword: false,
      password: '',
      repassword: ''
    }
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    UserMessage
  },
  created () {
    let token = localStorage.getItem('token')
    if (!token) {
      this.$router.go(-1)
    }
    let userId = this.$route.query.id
    if (userId) {
      this.$http.post(global.ip + '/showUser', {user_id: userId}).then((data) => {
        if (data.body.status === 1) {
          alert(data.body.message)
        } else {
          this.detail = data.body.data
          if (data.body.data.userStop) {
            this.userStatus = '用户已经被封停'
          } else {
            this.userStatus = '用户状态正常'
          }
        }
        console.log(data.body.data)
      })
    } else {
      alert('用户信息错误')
    }
  },
  methods: {
    ShowChangeUserPassword () {
      this.showRePassword = true
    },
    changeUserPassword () {
      let token = localStorage.token
      let userId = localStorage._id
      this.$http.post(global.ip + '/users/findPassword', {token: token, user_id: userId, repassword: this.repassword, password: this.password}).then((data) => {
        if (data.body.sataus === 1) {
          alert(data.body.message)
        } else {
          alert(data.body.message)
          this.$router.go(-1)
        }
      })
    },
    logout () {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('_id')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.box {
  display: inline-flex;
}
.container {
  width: 100%;
  margin: 0 auto;
}
.userMessage {
  padding-top: 60px;
  margin-top: -10px;
  margin-left: -10px;
}
</style>
