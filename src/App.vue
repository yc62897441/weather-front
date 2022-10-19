<template>
  <div id="app">
    <Navbar class="navbar" />
    <router-view />
    <Footer class="footer" />
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/base.css'

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>