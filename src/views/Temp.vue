<template>
  <div class="home">
    <form action="">
      <form-row>
        <label>資料種類</label>
        <select v-model="dataCategory">
          <option value="F-B0053-031">登山一週24小時天氣預報</option>
          <option value="F-B0053-033">登山一週日夜天氣預報</option>
          <option value="F-B0053-035">登山三天3小時天氣預報</option>
        </select>
      </form-row>
      <form-row>
        <label>資料格式</label>
        <select v-model="dataType">
          <option value="JSON">JSON</option>
        </select>
      </form-row>
    </form>
    <br>

    <div v-if="dataset.locations.location.length > 0">
      <h2>789</h2>
      <!-- <div v-for="locat in dataset.locations.location" v-bind:key="locat.parameterSet.parameter.parameterValue">
        {{ locat.locationName }}
      </div> -->
    </div>

    <table class="main__table">
      <thead>
        <tr class="table__header table__row">
          <th class="table__cell table__cell--name">名字</th>
          <th class="table__cell table__cell--lat">lat</th>
        </tr>
      </thead>
      <tbody class="table__body">
        <tr class="table__row" v-for="locat in dataset.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <td class="table__cell table__cell--name">{{  locat.locationName  }}</td>
          <td class="table__cell table__cell--lat">{{  locat.lat  }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import indexAPI from '../api/index'

export default {
  name: 'HomeView',
  data() {
    return {
      dataCategory: '',
      dataType: '',
      dataset: {
        locations: {
          location: []
        }
      }
    }
  },
  methods: {
    async press() {
      try {
        const dataCategory = this.dataCategory
        const dataType = this.dataType
        const response = await indexAPI.test({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        this.dataset = {
          ...response.data.dataset
        }

        console.log('response', response)
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>
