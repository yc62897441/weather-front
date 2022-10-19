<template>
  <div class="home">
    <div class="main-container main-container-signinup overflow-default-hidden">
      <div class="title-wrapper">
        <h1>Signup</h1>
      </div>
      <div class="signinup_container">
        <form class="signinup_form_wrapper">
          <div class="mb-3">
            <label class="form-label" for="signup_account">Account</label>
            <input class="form-control" type="text" id="signup_account" v-model="account" required>
          </div>
          <div class="mb-3">
            <label class="form-label" for="signup_password">Password</label>
            <input class="form-control" type="password" id="signup_password" v-model="password" required>
          </div>
          <div class="mb-3">
            <label class="form-label" for="signup_password_confirm">Password Confirm</label>
            <input class="form-control" type="password" id="signup_password_confirm" v-model="passwordConfirm" required>
          </div>
        </form>
        <button type="button" class="btn btn-primary" v-on:click="submitSignup">Submit</button>
        <div class="signinup_link_wrapper">
          <router-link to="/signin"> 登入 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexAPI from '../api/index'
import { Toast } from '../utils/helpers'

export default {
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
          Toast.fire({
            icon: 'warning',
            title: 'Account、Password、Password Confirm 不可空白'
          })
          return
        }
        if (this.password !== this.passwordConfirm) {
          Toast.fire({
            icon: 'warning',
            title: 'Password、Password Confirm 不一致'
          })
          this.password = ''
          this.passwordConfirm = ''
          return
        }

        const formData = {
          account: this.account,
          password: this.password
        }

        const response = await indexAPI.signup({ formData })

        if (response.data.status !== 'success') {
          this.password = ''
          this.passwordConfirm = ''
          throw new Error(response.data.message)
        }

        // 跳轉頁面，導入首頁
        this.$router.push('/signin')
        Toast.fire({
          icon: 'success',
          title: '註冊成功，請用新帳號登入'
        })
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