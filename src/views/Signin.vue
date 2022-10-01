<template>
  <div class="home">
    <Navbar class="navbar" />
    <div class="main-container main-container-signinup overflow-default-hidden">
      <div class="title-wrapper">
        <h1>Signin</h1>
      </div>
      <div class="signinup_container">
        <form class="signinup_form_wrapper">
          <div class="mb-3">
            <label class="form-label" for="signin_account">Account</label>
            <input class="form-control" type="text" id="signin_account" v-model="account" required>
          </div>
          <div class="mb-3">
            <label class="form-label" for="signin_password">Password</label>
            <input class="form-control" type="password" id="signin_password" v-model="password" required>
          </div>
        </form>
        <button type="button" class="btn btn-primary" v-on:click="submitSignin">Submit</button>
        <div class="signinup_link_wrapper">
          <router-link to="/signup"> 註冊 </router-link>
        </div>
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

<style>
.overflow-default-hidden {
  overflow: hidden;
}

.main-container-signinup .title-wrapper {
  display: block;
  width: 200px;
  margin: 25px auto 0px;
}

.signinup_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  margin: 0px auto 10px;
}

.signinup_form_wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.signinup_form_wrapper label {
  margin-bottom: 3px;
}

.signinup_form_wrapper input {
  margin-bottom: 8px;
}

.signinup_container .btn {
  width: 75px;
  padding: 2px 3px;
}

.signinup_link_wrapper {
  margin-top: 5px;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .main-container-signinup .title-wrapper {
    width: 400px;
    margin: 50px auto 0px;
  }

  .signinup_container {
    width: 400px;
    margin: 0px auto 20px;
  }

  .signinup_form_wrapper label {
    margin-bottom: 5px;
  }

  .signinup_form_wrapper input {
    margin-bottom: 12px;
  }

  .signinup_container .btn {
    width: 150px;
    padding: 4px 6px;
  }

  .signinup_link_wrapper {
    margin-top: 10px;
  }
}
</style>