<template>
  <div class="container">
    <div>
      <movie-index-header></movie-index-header>
    </div>
    <div class="contentMain">
      <div>
        <div class="contentLeft">
          <ul class="cont-ul">
            <movies-list v-for="item in movieItems" :key="item._id" :id="item._id" :movieName="item.movieName" :movieTime="item.movieTime"></movies-list>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <common-footer></common-footer>
    </div>
  </div>
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import MoviesList from '../components/MoviesList'

export default {
  data () {
    return {
      movieItems: []
    }
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    MoviesList
  },
  created () {
    this.$http.get(global.ip + '/movie/list').then((data) => {
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
  padding-top: 150px;
}
.contentText {
  font-size: 15px;
  padding-top: 20px;
}
</style>
