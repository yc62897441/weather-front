<template>
  <div class="home">
    <form action="">
      <form-row>
        <label>資料種類</label>
        <select v-model="dataCategory">
          <option value="F-D0047-001">宜蘭縣未來2天天氣預報</option>
          <option value="F-D0047-005">桃園市未來2天天氣預報</option>
        </select>
      </form-row>
      <form-row>
        <label>資料格式</label>
        <select v-model="dataType">
          <option value="JSON">JSON</option>
          <option value="XML">XML</option>
        </select>
      </form-row>
    </form>
    <button class="press" v-on:click="press">press</button>
  </div>
</template>

<script>
import indexAPI from '../api/index'

export default {
  name: 'HomeView',
  data() {
    return {
      dataCategory: '',
      dataType: ''
    }
  },
  methods: {
    async press() {
      try {
        const dataCategory = this.dataCategory
        const dataType = this.dataType
        const response = await indexAPI.test({ dataCategory, dataType })
        console.log('response', response)
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>
