<template>
  <div class="main-container main-container-weatheroverview">
    <h1>天氣總覽</h1>
    <table class="main-table">
      <thead class="table-header">
        <tr class="table-row">
          <th class="table-cell table-cell-name"></th>
          <th class="table-cell table-cell-each-day"
            v-for="time in propDatasetOneWeek.locations.location[0].weatherElement[3].time"
            v-bind:key="'date' + time.startTime">
            <div>{{ time.startTime.slice(0, 10) }}</div>
            <div>
              <div>最高溫</div>
              <div>最低溫</div>
              <div>降雨機率</div>
              <div>天氣現象</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr class="table-row" v-for="locat in propDatasetOneWeek.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <td class="table-cell table-cell-name">
            <router-link class="link" v-bind:to="'/mountain/' + locat.parameterSet.parameter.parameterValue">
              {{ locat.locationName }}
            </router-link>
          </td>
          <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
            <div>
              <div>{{ locat.weatherElement[3].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[4].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[9].time[index - 1].elementValue.value || 'NA' }}%</div>
              <div>{{ locat.weatherElement[12].time[index - 1].elementValue[0].value }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    propDatasetOneWeek: {
      type: Object
    }
  }
}

</script>

<style>
.table-header .table-cell-each-day > div:nth-child(1) {
  font-size: 1.2rem;
  padding: 3px 0px;
}

.table-cell-each-day div div {
  padding: 5px 0px;
}

.table-cell-each-day div div:not(:nth-child(4)) {
  border-right: 1px solid rgb(18, 52, 86, 0.4);
  flex: 1;
}

.table-cell-each-day div div:nth-child(1) {
  color: firebrick;
}

.table-cell-each-day div div:nth-child(2) {
  color: darkblue
}
</style>