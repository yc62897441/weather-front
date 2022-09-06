<template>
  <div class="home">
    <Navbar />
    <h1>signin</h1>
    <div class="main-container">
      <div class="signin_form_container">
        <form>
          <div class=" mb-3">
            <label for="signin_account" class="form-label">Account</label>
            <input type="text" class="form-control" id="signin_account" v-model="account">
          </div>
          <div class="mb-3">
            <label for="signin_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="signin_password" v-model="password">
          </div>
          <button type="button" class="btn btn-primary" v-on:click="submitSignin">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import indexAPI from '../api/index'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    async submitSignin() {
      try {
        if (!this.account || !this.password) {
          // do something
          console.log('account、password 不可空白')
          return
        }

        const formData = {
          account: this.account,
          password: this.password
        }

        const response = await indexAPI.signin({ formData })
        console.log('response', response)

        console.log('submitSignin')
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>