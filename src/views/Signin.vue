<template>
  <div class="home">
    <Navbar class="navbar"/>
    <h1>signin</h1>
    <div class="main-container">
      <div class="signin_form_container">
        <form>
          <div class=" mb-3">
            <label for="signin_account" class="form-label">Account</label>
            <input type="text" class="form-control" id="signin_account" v-model="account" required>
          </div>
          <div class="mb-3">
            <label for="signin_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="signin_password" v-model="password" required>
          </div>
          <button type="button" class="btn btn-primary" v-on:click="submitSignin">Submit</button>
        </form>
      </div>
      <div>
        <router-link to="/signup"> 註冊 </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import indexAPI from '../api/index'
import { Toast } from '../utils/helpers'

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
          Toast.fire({
            icon: 'warning',
            title: 'Account、Password 不可空白'
          })
          return
        }

        const formData = {
          account: this.account,
          password: this.password
        }

        const response = await indexAPI.signin({ formData })

        if (response.data.status !== 'success') {
          this.password = ''
          throw new Error(response.data.message)
        }

        // 登入驗證成功
        // 儲存 token 到瀏覽器內 
        localStorage.setItem('token', response.data.token)

        // 將 Vue 物件提交 mutation 事件，'setCurrentUser' 是在 mutations 定義好的 setCurrentUser
        this.$store.commit('setCurrentUser', response.data.user)

        // 跳轉頁面，導入首頁
        this.$router.push('/')
      } catch (error) {
        console.warn(error)
        Toast.fire({
          icon: 'warning',
          title: error
        })
      }
    }
  }
}
</script>