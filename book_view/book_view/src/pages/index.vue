<template>
  <div class="container">
    <div>
      <movie-index-header></movie-index-header>
    </div>
    <div class="userMessage">
      <user-message></user-message>
    </div>
    <div class="contentPic">
      <index-header-pic v-for="item in headerItems" :key="item._id" :recommendImg="item.recommendImg" :recommendSrc="item.recommendSrc" :recommendTitle="item.recommendTitle"></index-header-pic>
    </div>
    <div class="contentMain">
      <Row>
        <i-col span="11" offset="1">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              电影
            </p>
            <ul class="cont-ul">
              <movies-list v-for="item in movieItems" :key="item._id" :id="item._id" :movieName="item.movieName" :movieTime="item.movieTime"></movies-list>
            </ul>
          </Card>
        </i-col>
        <i-col span="10" offset="1">
          <Card>
            <p slot="title">
              <Icon type="ios-albums-outline"></Icon>
              新闻
            </p>
            <ul class="cont-ul">
              <news-list v-for="item in newsItems" :key="item._id" :id="item._id" :articleTitle="item.articleTitle" :articleTime="item.articleTime"></news-list>
            </ul>
          </Card>
        </i-col>
      </Row>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import NewsList from '../components/NewsList'
import MoviesList from '../components/MoviesList'
import IndexHeaderPic from '../components/IndexHeaderPic'
import UserMessage from '../components/UserMessage'

export default {
  data () {
    return {
      headerItems: [],
      newsItems: [],
      movieItems: []
    }
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    NewsList,
    MoviesList,
    IndexHeaderPic,
    UserMessage
  },
  created () {
    // 主页推荐
    this.$http.get(global.ip + '/showIndex').then((data) => {
      this.headerItems = data.body.data
      console.log(data.body)
    })
    // 获取新闻
    this.$http.get(global.ip + '/showArticle').then((data) => {
      this.newsItems = data.body.data
      console.log(data.body)
    })
    // 获取所有电影
    this.$http.get(global.ip + '/showRanking').then((data) => {
      this.movieItems = data.body.data
      console.log(data.body)
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
  padding-top: 15px;
}
.contentPic {
  padding-top: 5px;
}
.userMessage {
  margin-top: 0px;
  margin-left: 0px;
}
.contentLeft {
  width: 60%;
  float: left;
  margin-top: 5px;
  border-top: 1px solid #000;
}
.contentRight {
  width: 38%;
  margin-left: 1%;
  float: left;
  margin-top: 5px;
  border-top: 1px solid #000;
}
.cont-ul {
  padding-top: .5rem;
  background-color: #fff;
}
.cont-ul::after {
  content: '';
  display: block;
  clear: both;
  width: 0;
  height: 0;
}
</style>
