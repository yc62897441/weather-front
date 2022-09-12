<template>
  <div class="home">
    <Navbar />
    <h1>signup</h1>
    <div class="main-container">
      <div class="signup_form_container">
        <form>
          <div class=" mb-3">
            <label for="signup_account" class="form-label">Account</label>
            <input type="text" class="form-control" id="signup_account" v-model="account">
          </div>
          <div class="mb-3">
            <label for="signup_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="signup_password" v-model="password">
          </div>
          <div class="mb-3">
            <label for="signup_password_confirm" class="form-label">Password Confirm</label>
            <input type="password" class="form-control" id="signup_password_confirm" v-model="passwordConfirm">
          </div>
          <button type="button" class="btn btn-primary" v-on:click="submitSignup">Submit</button>
        </form>
      </div>
      <div>
        <router-link to="/signin"> 登入 </router-link>
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
      password: '',
      passwordConfirm: ''
    }
  },
  methods: {
    async submitSignup() {
      try {
        if (!this.account || !this.password || !this.passwordConfirm) {
          // do something
          console.log('account、password、passwordConfirm 不可空白')
          return
        }
        if (this.password !== this.passwordConfirm) {
          // do something
          console.log('Password、Password Confirm 不一致')
          this.password = ''
          this.passwordConfirm = ''
          return
        }

        const formData = {
          account: this.account,
          password: this.password
        }

        const response = await indexAPI.signup({ formData })

        // 跳轉頁面，導入首頁
        this.$router.push('/signin')
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>