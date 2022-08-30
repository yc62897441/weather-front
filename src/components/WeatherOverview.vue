<template>
  <div class="main-container main-container-weatheroverview">
    <h1>天氣總覽</h1>
    <table class="main-table">
      <thead class="table-header">
        <tr class="table-row">
          <th class="table-cell table-cell-name">名字</th>
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
          <td class="table-cell table-cell-name">{{ locat.locationName }}</td>
          <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
            <div>
              <div>{{ locat.weatherElement[3].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[4].time[index - 1].elementValue.value }}°C</div>
              <div>{{ locat.weatherElement[9].time[index - 1].elementValue.value }}%</div>
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