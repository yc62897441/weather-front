<template>
  <div class="home">
    <Navbar />
    <template>
      <div class="main-container main-container-weathermap">
        <h1>天氣地圖</h1>
      </div>
    </template>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    Footer
  },
  computed: {
    ...mapState(['datasetOneWeek', 'datasetPerThreeHours'])
  },
}
</script>
