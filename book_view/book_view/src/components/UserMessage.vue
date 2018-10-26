<template>
  <div v-if="!isLogin" class="header">
    <Row>
      <i-col span="2" offset="22">
        <router-link to="/loginPage">
          <div class="header_menu"><Icon type="person" />登陆</div>
        </router-link>
      </i-col>
    </Row>
  </div>
  <div v-else class="header">
    <Row>
      <i-col span="2" offset="22">
        <router-link :to="{path: '/userInfo', query: {id: id}}">
          <div class="header_menu"><Icon type="person" />已登陆：{{username}}</div>
        </router-link>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: false,
      username: ''
    }
  },
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.isLogin = true
      this.username = localStorage.getItem('username')
      this.id = localStorage.getItem('_id')
    } else {
      console.log('用户登录失败')
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 30px;
  left: 0;
  top: 0;
  color: #000;
  background-color: #C3bbbb;
}
.header_menu {
  padding-top: 6px;
  color: #fff;
  font-size: 12px;
}
</style>
