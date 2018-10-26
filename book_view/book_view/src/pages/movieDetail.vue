<template>
  <div class="container">
    <div>
      <movie-index-header></movie-index-header>
    </div>
    <div class="contentMain">
      <div>
        <h1>{{detail.movieName}}</h1>
        <div class="viewNum">下载次数：{{detail.movieNumDownload}}</div>
      </div>
      <div>
        <button @click="movieDownload">点击下载</button>
      </div>
      <div>
        <img :src=detail.movieImg class="headerImg">
      </div>
      <div @click="support" class="btnPosition">
        <div class="SupportBtn">点赞<div>{{detail.movieNumSuppose}}</div></div>
      </div>
    </div>
    <div>
      <comment v-bind:movieId="movieId"></comment>
    </div>
    <div>
      <common-footer></common-footer>
    </div>
  </div>
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import Comment from '../components/Comment'

let movieId = 0

export default {
  name: 'MovieDetail',
  data () {
    return {
      detail: {},
      movieId: ''
    }
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    Comment
  },
  created () {
    this.movieId = this.$route.query.id
    movieId = this.$route.query.id
    this.$http.post(global.ip + '/movie/detail', {movie_id: movieId}).then((data) => {
      this.detail = data.body.data
    })
  },
  methods: {
    // 点赞
    support (event) {
      this.$http.post(global.ip + '/movie/support', {id: movieId}).then((data1) => {
        let dataTemp = data1.body
        let that = this
        console.log(dataTemp)
        if (dataTemp.status === 0) {
          this.$http.post(global.ip + '/movie/showNumber', {id: movieId}).then((data2) => {
            that.detail['movieNumSuppose'] = data2.body.data.movieNumSuppose
          })
        } else {
          alert(dataTemp.message)
        }
      })
    },
    // 下载
    movieDownload (event) {
      this.$http.post(global.ip + '/movie/download', {id: movieId}).then((data) => {
        let dataTemp = data.data
        if (dataTemp.status === 1) {
          alert(dataTemp.message)
        } else {
          // console.log(data.data)
          window.location = dataTemp.data
        }
      })
    }
  }
}
</script>

<style scoped>
.headerImg {
  height: 200px;
}
.container {
  width: 100%;
  margin: 0 auto;
}
.contentMain {
  padding-top: 150px;
}
.btnPosition {
  padding-left: 48%;
}
.SupportBtn {
  border: solid 1px #000;
  width: 60px;
}
.viewNum {
  font-size: 10px;
}
</style>
