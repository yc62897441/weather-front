<template>
  <div class="home">
    <template>
      <div class="main-container main-container-weatherfilter overflow-default-hidden">
        <div class="title-wrapper">
          <h1>天氣條件檢索</h1>
        </div>
        <div class="filter-control-wrapper">
          <form class="filterConditions-wrapper">
            <div class="form-row">
              <label class="form-label">日期</label>
              <div class="select-wrapper">
                <select class="form-select" name="a-type" id="a-type" v-model="filterConditions.date" required>
                  <option v-bind:value="0" selected>{{
                  datasetOneWeek.locations.location[0].weatherElement[3].time[0].startTime.slice(0, 10) }}
                  </option>
                  <option v-bind:value="index" v-for="index in 6" v-bind:key="index">{{
                  datasetOneWeek.locations.location[0].weatherElement[3].time[index].startTime.slice(0, 10) }}
                  </option>
                </select>
              </div>
            </div>

            <label class="form-label" for="highestTemperature">最高溫(小於等於)</label>
            <input class="form-control" id="highestTemperature" type="number" min="-20" max="50"
              v-model="filterConditions.highestTemperature.value">

            <label class="form-label" for="lowestTemperature">最低溫(大於等於)</label>
            <input class="form-control" id="lowestTemperature" type="number" min="-20" max="50"
              v-model="filterConditions.lowestTemperature.value">

            <label class="form-label" for="rainrate">降雨機率(小於等於)</label>
            <input class="form-control" id="rainrate" type="number" min="0" max="100"
              v-model="filterConditions.rainrate.value">
          </form>
          <button class="btn btn-primary" v-on:click="filter">Filter</button>
        </div>

        <template v-if="filterMountains.length > 0">
          <table class="main-table">
            <thead class="table-header">
              <tr class="table-row">
                <th class="table-cell table-cell-name"></th>
                <th class="table-cell table-cell-each-day" v-for="time in filterMountains[0].weatherElement[3].time"
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
              <tr class="table-row" v-for="locat in filterMountains"
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
                    <div>
                      <img
                        v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + locat.weatherElement[12].time[index - 1].elementValue[1].value +'.svg'"
                        v-bind:title="locat.weatherElement[12].time[index - 1].elementValue[0].value"
                        v-bind:alt="locat.weatherElement[12].time[index - 1].elementValue[0].value">
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

      </div>
    </template>
  </div>
</template>

<script>
import indexAPI from '../api/index'
import { Toast } from '../utils/helpers'

export default {
  data() {
    return {
      dataCategory: {
        oneWeek: 'F-B0053-031', //登山一週24小時天氣預報
        oneWeekDayNight: 'F-B0053-033', //登山一週日夜天氣預報 33
        perThreeHours: 'F-B0053-035' //登山三天3小時天氣預報
      },
      dataType: 'JSON',
      datasetOneWeek: {
        locations: {
          location: []
        }
      },
      isLoading: true,
      filterMountains: [],
      filterConditions: {
        date: 0,
        highestTemperature: {
          value: 30,
          index: 3
        },
        lowestTemperature: {
          value: 20,
          index: 4
        },
        rainrate: {
          value: 50,
          index: 9
        }
      }
    }
  },
  methods: {
    async fetchDatasetOneWeek() {
      try {
        this.isLoading = true
        const dataCategory = this.dataCategory.oneWeek
        const dataType = this.dataType
        const response = await indexAPI.getWeatherData({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        this.datasetOneWeek = {
          ...response.data.dataset
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
    filter() {
      Toast.fire({
        icon: 'warning',
        title: '檢索中'
      })

      // main-container 的 overflow 切換回 scroll 設定
      this.removeOverflowHidden()

      this.filterMountains = []
      let date = this.filterConditions.date
      // 最高溫 <= 最高溫篩選值 && 最低溫 >= 最低溫篩選值 && 降雨機率 <= 降雨機率篩選值
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (Number(locat.weatherElement[3].time[date].elementValue.value) <= Number(this.filterConditions.highestTemperature.value) && Number(locat.weatherElement[4].time[date].elementValue.value) >= Number(this.filterConditions.lowestTemperature.value) && Number(locat.weatherElement[9].time[date].elementValue.value) <= Number(this.filterConditions.rainrate.value)) {
          // 加入該地點到清單中
          this.filterMountains.push(locat)
        }
      })

      if (this.filterMountains.length === 0) {
        Toast.fire({
          icon: 'error',
          title: '檢索完成，無匹配結果'
        })
      } else {
        Toast.fire({
          icon: 'success',
          title: '檢索完成'
        })
      }
    },
    // 在 css 檔有設定 .main-container overflow: scroll; 就算還沒檢所出資料，畫面也會有一條卷軸，不好看，所以先隱藏起來。等到開始檢索時再還原成 overflow: scroll;
    removeOverflowHidden() {
      const mainContainerWeatherfilter = document.querySelector('.main-container-weatherfilter')
      mainContainerWeatherfilter.classList.remove('overflow-default-hidden')
      mainContainerWeatherfilter.classList.add('overflow-scroll')
    }
  },
  mounted() {
    this.fetchDatasetOneWeek()
  }
}
</script>

<style>
/* 在 css 檔有設定 .main-container overflow: scroll; 就算還沒檢所出資料，畫面也會有一條卷軸，不好看，所以先隱藏起來。等到開始檢索時再還原成 overflow: scroll; */
.overflow-default-hidden {
  overflow: hidden;
}

.overflow-scroll {
  overflow: scroll;
}

.main-container-weatherfilter .title-wrapper {
  display: block;
  width: 200px;
  margin: 0px auto;
}

.filter-control-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  margin: 0px auto 10px;
}

.filterConditions-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.filterConditions-wrapper label {
  margin-bottom: 3px;
}

.filterConditions-wrapper .form-row,
input {
  margin-bottom: 8px;
}

.filter-control-wrapper .btn {
  width: 75px;
  padding: 2px 3px;
}

/* Small devices (landscape phones, 374px and down) */
@media (min-width: 375px) {}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .main-container-weatherfilter .title-wrapper {
    width: 400px;
    margin: 0px auto;
  }

  .filter-control-wrapper {
    width: 400px;
    margin: 0px auto 20px;
  }

  .filterConditions-wrapper label {
    margin-bottom: 5px;
  }

  .filterConditions-wrapper .form-row,
  input {
    margin-bottom: 12px;
  }

  .filter-control-wrapper .btn {
    width: 150px;
    padding: 4px 6px;
  }
}
</style>