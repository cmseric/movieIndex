<template>
  <div class="message">
    <div>
      {{fromUserName}}
    </div>
    <div>
      {{title}}
    </div>
    <div>
      {{context}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'fromUserName', 'context']
}
</script>

<style scoped>
.message {
  border: 1px solid;
}
</style>
