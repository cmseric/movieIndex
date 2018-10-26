<template>
  <div class="goods-list">
    <div class="newsList">
      <router-link :to="{path: '/newsDetail', query: {id: id}}" class="goods-list-link">
        {{articleTitle}}
        {{articleTimeShow}}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articleTimeShow: ''
    }
  },
  props: ['id', 'articleTitle', 'articleTime'],
  created () {
    this.articleTimeShow = new Date(parseInt(this.articleTime)).toLocaleString().replace(/: \d{1,2}$/, ' ')
  }
}
</script>

<style scoped>
.newsList {
  padding: 5px;
  border-bottom: 1px dashed #ababab;
}
</style>
