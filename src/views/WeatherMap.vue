<template>
  <div class="home">
    <Navbar />
    <template>
      <div class="main-container main-container-weathermap">
        <h1>天氣地圖</h1>
        <div id="map"></div>
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
      new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });
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
  width: 600px;
  height: 400px;
}
</style>