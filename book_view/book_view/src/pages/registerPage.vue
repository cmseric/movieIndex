<template>
  <div>
    <div>
      <div>
        <div class="box">
          <label>输入用户名：</label>
          <input v-model="username" placeholder="用户名">
        </div>
        <div class="box">
          <label>输入密码：</label>
          <input v-model="password" placeholder="密码">
        </div>
        <div class="box">
          <label>重复输入密码</label>
          <input v-model="rePassword" placeholder="密码">
        </div>
        <div class="box">
          <label>输入邮箱：</label>
          <input v-model="userMail" placeholder="邮箱">
        </div>
        <div class="box">
          <label>输入手机：</label>
          <input v-model="userPhone" placeholder="手机">
        </div>
        <div class="box">
          <button @click="userRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      userMail: '',
      userPhone: '',
      rePassword: ''
    }
  },
  methods: {
    userRegister (event) {
      if (this.password !== this.rePassword) {
        alert('两次密码不一致')
      } else {
        let sendData = {
          username: this.username,
          password: this.password,
          userMail: this.userMail,
          userPhone: this.userPhone
        }
        this.$http.post(global.ip + '/users/register', sendData).then((data) => {
          if (data.body.status === 1) {
            alert(data.body.message)
          } else {
            alert(data.body.message)
            this.$router.go(-1)
          }
        })
      }
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
