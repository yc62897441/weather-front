<template>
  <div class="home">
    <Navbar />
    <h1>test</h1>
    
    <a class="btn btn-success"
      v-bind:href='"https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657482181&redirect_uri=https://side-project-weather-end.herokuapp.com/api/auth/line/callback&state="+currentUser.account+"&scope=profile%20openid"'>Login
      with Line 9/24 測試: 把 user.account 傳入 state 參數</a>

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
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>
