<template>
  <div class="home">
    <Navbar />
    <template>
      <div class="main-container main-container-weathermap">
        <h1>天氣地圖</h1>
        <div id="map"></div>
        <div class="mark_mountain_wrapper" v-for="locat in datasetPerThreeHours.locations.location"
          v-bind:key="locat.parameterSet.parameter.parameterValue">
          <router-link class="overlay link" v-bind:id="'MtId'+ locat.parameterSet.parameter.parameterValue"
            v-bind:to="'/mountain/' + locat.parameterSet.parameter.parameterValue" target="_blank">
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
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { mapState } from 'vuex'

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import Overlay from 'ol/Overlay'
import { fromLonLat, toLonLat } from 'ol/proj';

export default {
  components: {
    Navbar,
    Footer
  },
  computed: {
    ...mapState(['datasetOneWeek', 'datasetPerThreeHours'])
  },
  methods: {
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
    aa() {
      // 校正奇萊南峰位置
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>
#map {
  display: block;
  /* position: absolute;
  top: 100px;
  bottom: 0; */
  width: 1200px;
  height: 800px;
}

.mark_mountain_wrapper {
  margin: 10px 0px;
}

.mark_mountain_info_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 4px 2px;
  border: 1px solid rgb(85, 85, 85, 0.5);
  border-radius: 5px;
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 1rem;
  background-color: rgb(255, 255, 255, 0.75);
}

.mark_mountain_info_name {
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

.mark_mountain_info_Wx {
  width: 40px;
  height: 40px;
}

.mark_mountain_info_Wx img {
  width: 40px;
  height: 40px;
}
</style>