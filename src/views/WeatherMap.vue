<template>
  <div class="home">
    <template>
      <div class="main-container main-container-weathermap">
        <div class="title-wrapper">
          <h1>山岳地圖</h1>
        </div>
        <div id="map"></div>
        <div class="mark_mountain_wrapper" v-for="locat in datasetPerThreeHours.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <!-- 拿掉屬性 target="_blank"，不會以新開分頁的方式開啟連結 -->
          <router-link class="overlay link" v-bind:id="'MtId'+ locat.parameterSet.parameter.parameterValue"
            v-bind:to="'/mountain/' + locat.parameterSet.parameter.parameterValue">
            <div class="mark_mountain_info_wrapper">
              <div class="mark_mountain_info_name">
                {{locat.locationName}}
              </div>
              <div class="mark_mountain_info_value">
                <div> {{locat.weatherElement[0].time[0].elementValue.value}}°C</div>
                <div>{{locat.weatherElement[3].time[0].elementValue.value}}%</div>
              </div>
              <div class="mark_mountain_info_Wx">
                <img
                  v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + locat.weatherElement[9].time[0].elementValue[1].value +'.svg'"
                  v-bind:title="locat.weatherElement[9].time[0].elementValue[0].value"
                  v-bind:alt="locat.weatherElement[9].time[0].elementValue[0].value">
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import indexAPI from '../api/index'

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import Overlay from 'ol/Overlay'
import { fromLonLat, toLonLat } from 'ol/proj';

export default {
  data() {
    return {
      dataCategory: {
        oneWeek: 'F-B0053-031', //登山一週24小時天氣預報
        oneWeekDayNight: 'F-B0053-033', //登山一週日夜天氣預報 33
        perThreeHours: 'F-B0053-035' //登山三天3小時天氣預報
      },
      dataType: 'JSON',
      datasetPerThreeHours: {
        locations: {
          location: []
        }
      },
      isLoading: true
    }
  },
  methods: {
    async fetchDatasetPerThreeHours() {
      try {
        this.isLoading = true
        const dataCategory = this.dataCategory.perThreeHours
        const dataType = this.dataType
        const response = await indexAPI.getWeatherData({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        this.datasetPerThreeHours = {
          ...response.data.dataset
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
    initMap() {
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        ],
        view: new View({
          center: [13450000, 2720000],
          zoom: 8,
        })
      })

      this.datasetPerThreeHours.locations.location.forEach(locat => {
        this.markMountains(map, locat)
      })
    },
    markMountains(map, locat) {
      const pos = fromLonLat([Number(locat.lon), Number(locat.lat)])
      const router_link_id = 'MtId' + locat.parameterSet.parameter.parameterValue
      const mt_label = new Overlay({
        position: pos,
        element: document.getElementById(router_link_id)
      })
      map.addOverlay(mt_label)
    },
    adjust() {
      // 校正奇萊南峰位置(氣象局的座標跟南華山(能高北峰)重複)
      this.datasetPerThreeHours.locations.location[46].lat = '24.066'
      this.datasetPerThreeHours.locations.location[46].lon = '121.280036765'
    }
  },
  async mounted() {
    try {
      await this.fetchDatasetPerThreeHours()
      this.adjust()
      this.initMap()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style>
.main-container-weathermap {
  overflow: hidden;
}

.main-container-weathermap .title-wrapper {
  position: relative;
  width: 250px;
  margin: 0px auto;
}

#map {
  /* 讓手機板地圖左右貼滿銀幕，把 main-container 讀 padding-left 15px 減回去 */
  position: relative;
  top: 0px;
  left: -15px;
  display: block;
  width: 100vw;
  height: 450px;
  margin: 0px auto;
}

.mark_mountain_info_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 4px 1px;
  border: 1px solid rgb(85, 85, 85, 0.5);
  border-radius: 5px;
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 0.7rem;
  background-color: rgb(255, 255, 255, 0.75);
}

.mark_mountain_info_name {
  margin-bottom: 2px;
  font-weight: 700;
}

.mark_mountain_info_value {
  display: flex;
  flex-direction: row;
}

.mark_mountain_info_value div:nth-child(1) {
  margin-right: 4px;
  color: firebrick;
  font-weight: 400;
}

.mark_mountain_info_value div:nth-child(2) {
  color: darkblue;
  font-weight: 400;
}

.mark_mountain_info_Wx img {
  width: 25px;
  height: 25px;
  object-fit: cover;
}

@media (min-width: 375px) {
  .main-container-weathermap .title-wrapper {
    width: 350px;
  }

  #map {
    width: 100vw;
    height: 600px;
  }

  .mark_mountain_info_wrapper {
    padding: 4px 4px 2px;
    font-size: 0.8rem;
  }
}

@media (min-width: 576px) {
  .main-container-weathermap .title-wrapper {
    width: 550px;
  }

  #map {
    position: static;
    left: 0px;
    width: 550px;
    height: 700px;
  }

  .mark_mountain_info_wrapper {
    padding: 5px 5px 2px;
    font-size: 1rem;
  }

  .mark_mountain_info_Wx img {
    width: 32px;
    height: 32px;
  }
}

@media (min-width: 768px) {
  .main-container-weathermap .title-wrapper {
    width: 730px;
  }

  #map {
    width: 730px;
    height: 750px;
  }

  .mark_mountain_info_Wx img {
    width: 35px;
    height: 35px;
  }
}

@media (min-width: 992px) {
  .main-container-weathermap .title-wrapper {
    width: 950px;
  }

  #map {
    width: 950px;
  }
}
</style>