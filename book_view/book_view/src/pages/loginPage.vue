<template>
  <div>
    <div class="box">
      <div style="width: 30%;padding-top: 10%;">
        <label>LOGIN</label>
        <div>
          <i-input type="text" v-model="username" placeholder="用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </div>
        <div class="box">
          <i-input type="password" v-model="password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
        </div>
      </div>
    </div>
    <div class="box">
      <i-button type="primary" @click="userLogin">登陆</i-button>
      <i-button style="margin-left: 10px;" @click="userRegister">注册</i-button>
      <i-button type="text" style="margin-left: 10px;" @click="findBackPassword">忘记密码</i-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    userLogin (event) {
      this.$http.post(global.ip + '/users/login', {username: this.username, password: this.password}).then((data) => {
        if (data.body.status === 1) {
          alert(data.body.message)
        } else {
          let saveToken = {
            token: data.body.data.token,
            username: this.username
          }
          localStorage.setItem('token', saveToken.token)
          localStorage.setItem('username', saveToken.username)
          localStorage.setItem('_id', data.body.data.user[0]._id)
          this.$router.go(-1)
        }
      })
    },
    userRegister (event) {
      this.$router.push({path: 'register'})
    },
    findBackPassword (event) {
      this.$router.push({path: 'findPassword'})
    }
  }
}
</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
</style>
