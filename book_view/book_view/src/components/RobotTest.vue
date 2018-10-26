<template>
  <div id="">
    <p>
      提问：
      <input v-model="question"/>
    </p>
    <p>{{ answer }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      question: '',
      answer: '你还没有问人家问题呀～'
    }
  },
  watch: {
    question: function () {
      this.answer = '等待发问~~'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer () {
      if (this.question.indexOf('?') !== -1) {
        this.answer = '思考中……'
        let that = this
        this.$http.post('http://robottest.uneedzf.com/api/talk2Robot', {token: '3fb83aa4c1fbc827e63175d12e420be8', message: that.question})
          .then(function (response) {
            if (response.data.code === 0) {
              that.answer = response.data.data
            } else {
              that.answer = response.data.message
            }
          })
      } else {
        this.answer = '一个问题一般由一个?结尾哦' + '♪(^▽^*)'
        return 0
      }
    }
  }
}
</script>
