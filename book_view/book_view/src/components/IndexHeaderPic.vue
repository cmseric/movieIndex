<template>
  <div class="headerPic">
    <div>
      <p class="imgTitle">{{recommendTitle}}</p>
      <a v-bind:href=recommendSrc>
        <img v-bind:src=recommendImg class="headerImg">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'recommendSrc',
    'recommendImg',
    'recommendTitle'
  ]
}
</script>

<style scoped>
.headerPic {
  height: 300px;
  width: 100%;
  background-color: antiquewhite;
}
.headerImg {
  height: 300px;
  width: auto;
}
.imgTitle {
  z-index: 2;
  padding-left: 45%;
  padding-top: 230px;
  position: absolute;
  color: #fff;
  font-size: 20px;
}
</style>
