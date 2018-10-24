<template>
  <div class="empty" >
    <img src="../assets/empty.png" alt="">
    <p>这里暂时还没有内容…</p>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    }
  }

</script>
<style scoped>
  .empty {
    padding-top: 50px;
  }

  .empty img {
    display: block;
    width: 168px;
    height: 154px;
    margin: 0 auto;

  }

  .empty p {
    font-size: 16px;
    color: #b2b2b2;
    text-align: center;
    padding-top: 24px;

  }

</style>
