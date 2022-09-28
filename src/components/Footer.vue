<template>
  <div class="footer-container">
    <h6>特別感謝資料來源：氣象資料開放平台</h6>
    <h6>https://opendata.cwb.gov.tw/dataset/forecast</h6>
  </div>
</template>

<script>

export default {

}
</script>

<style>
.footer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 75px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: #EEEEEE;
}

h6 {
  /* 文字強迫換行，英文字會被切一半 word-break: break-all;
    依單字換行 word-wrap: break-word;
    死都不換行 white-space: nowrap; */
  word-break: break-all;
}
</style>