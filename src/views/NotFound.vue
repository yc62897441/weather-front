<template>
  <div class="home">
    <Navbar class="navbar"/>
    <template>
      <div class="not-found-wrapper">
        <h1>
          404 Page Not Found
        </h1>
      </div>
    </template>
    <Footer class="footer"/>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
  background-color: #FBFBFB;
  font-size: 3rem;
}
</style>