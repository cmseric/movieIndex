<template>
  <div class="container">
    <div>
      <movie-index-header></movie-index-header>
    </div>
    <div class="contentMain">
      <h1>{{detail.articleTitle}}</h1>
      <div>{{detail.articleTime}}</div>
      <div class="contentText">{{detail.articleContext}}</div>
    </div>
    <comment :movieId="articleId"></comment>
    <div>
      <common-footer></common-footer>
    </div>
  </div>
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import Comment from '../components/Comment'

let articleId = 0

export default {
  name: 'newsDetail',
  data () {
    return {
      detail: [],
      articleId: ''
    }
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    Comment
  },
  created () {
    articleId = this.$route.query.id
    this.articleId = articleId
    this.$http.post(global.ip + '/articleDetail', {article_id: articleId}).then((data) => {
      this.detail = data.body.data[0]
      this.detail.articleTime = new Date(parseInt(this.detail.articleTime).toLocaleString())
    })
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
}
.contentMain {
  padding-top: 150px;
}
.contextText {
  font-size: 15px;
  padding-top: 20px;
}
</style>
