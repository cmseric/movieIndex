<template>
  <div>
    <label>评论</label>
    <hr>
    <div>
      <li v-for="(item, index) in items" :key="index">
        {{item.username}} 评论：{{item.context}}
      </li>
    </div>
    <div style="padding: 5px;">
      <textarea v-model="context" style="width: 80%;height: 50px;" placeholder="内容"></textarea>
    </div>
    <div style="padding-top: 10px;">
      <button @click="send_comment">评论</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['movieId'],
  data () {
    return {
      items: [],
      context: ''
    }
  },
  created () {
    console.log(this.movieId)
    this.getComment()
  },
  methods: {
    getComment () {
      this.$http.post(global.ip + '/movie/comment', {id: this.movieId}).then((data) => {
        if (data.body.status === 0) {
          this.items = data.body.data
        } else {
          alert('获取失败')
        }
      })
    },
    send_comment (event) {
      let sendData
      if (typeof (localStorage.username) !== 'undefined') {
        sendData = {
          movie_id: this.movieId,
          context: this.context,
          username: localStorage.username
        }
      } else {
        sendData = {
          movie_id: this.movieId,
          context: this.context
        }
      }
      let that = this
      this.$http.post(global.ip + '/users/postComment', sendData).then((data) => {
        alert(data.body.message)
        that.getComment()
        that.context = ''
      })
    }
  }
}
</script>
