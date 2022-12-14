<template>
  <div class="navbar-container">
    <div class="navbar-container-left">
      <input type="checkbox" class="navbar-toggle" id="navbar-toggle">
      <div class="navbar-wrapper">
        <div class="navbar-item">
          <router-link class="link" to="/">
            天氣總覽
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link class="link" to="/weatherFilter">
            天氣條件檢索
          </router-link>
        </div>
        <div class="navbar-item">
          <router-link class="link" to="/weatherMap">
            山岳地圖
          </router-link>
        </div>
      </div>
      <div class="burger-bar-wrapper">
        <label class="navbar-toggle-label" for="navbar-toggle">
          <img src="../assets/burger-bar.png" alt="">
        </label>
      </div>
      <div class="search-wrapper">
        <form>
          <input class="form-control" type="text" placeholder="搜尋山岳" aria-label="Search"
            v-on:keyup.prevent.stop="searchMountain" v-model="input">
        </form>
        <template v-if="input">
          <div class="search-list">
            <div class="search-list-item" v-for="item in searchMountainList" v-bind:key="item.id">
              <router-link class="link" v-bind:to="'/mountain/' + item.id"> {{ item.locationName }}</router-link>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="navbar-container-right">
      <div class="user-wrapper">
        <template v-if="isAuthenticated">
          <div class="navbar-item">
            <router-link class="link" to="/user/save">
              蒐藏列表
            </router-link>
          </div>
          <div v-on:click="signout" class="btn btn-danger">登出</div>
        </template>
        <template v-else>
          <router-link to="/signin">
            <div class="btn btn-success">登入or註冊</div>
          </router-link>
        </template>
        <!-- darkmode toggle -->
        <template>
          <div class="sidebar__menu__link">
            <label class="darkmode_label" for="darkmode_toggle">
              <img v-if="!darkMode" src="../assets/dark_mode_moon.png" title="夜間模式" v-on:click="switchMode">
              <img v-else src="../assets/dark_mode_sun.png" title="日間模式" v-on:click="switchMode">
            </label>
            <input type="checkbox" class="darkmode_input" id="darkmode_toggle" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import indexAPI from '../api/index'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dataCategory: {
        oneWeek: 'F-B0053-031', //登山一週24小時天氣預報
        oneWeekDayNight: 'F-B0053-033', //登山一週日夜天氣預報 33
        perThreeHours: 'F-B0053-035' //登山三天3小時天氣預報
      },
      dataType: 'JSON',
      datasetOneWeek: {
        locations: {
          location: []
        }
      },
      isLoading: true,
      input: '',
      searchMountainList: [],
    }
  },
  computed: {
    ...mapState(['isAuthenticated', 'darkMode'])
  },
  methods: {
    async fetchDatasetOneWeek() {
      try {
        this.isLoading = true
        const dataCategory = this.dataCategory.oneWeek
        const dataType = this.dataType
        const response = await indexAPI.getWeatherData({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        this.datasetOneWeek = {
          ...response.data.dataset
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
    searchMountain() {
      if (this.input.length > 0) {
        this.searchMountainList = []
        this.datasetOneWeek.locations.location.map(locat => {
          if (locat.locationName.includes(this.input)) {
            this.searchMountainList.push({
              locationName: locat.locationName,
              id: locat.parameterSet.parameter.parameterValue
            })
          }
        })
      }
    },
    signout() {
      this.$store.commit('revokeAuthentication')
      this.$router.push('/signin')
    },
    // dark mode switch
    switchMode() {
      if (!this.darkMode) {
        // 將 Vue 物件提交 mutation 事件，'switchDarkMode' 是在 mutations 定義好的 switchDarkMode
        this.$store.commit('switchDarkMode', true)
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        this.$store.commit('switchDarkMode', false)
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  },
  mounted() {
    this.fetchDatasetOneWeek()
  }
}
</script>

<style>
.navbar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 60px;
  background-color: var(--navbar-container);
}

.navbar-container-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
}

.navbar-container-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
}

.navbar-toggle {
  /*不佔空間*/
  position: absolute;
  visibility: hidden;
  display: none;
}

.navbar-toggle:checked~.navbar-wrapper {
  transform: scale(1, 1);
  transition: opacity 0.2s ease-out 0.15s;
  opacity: 1;
}

.navbar-wrapper {
  position: absolute;
  top: 100%;
  left: 0%;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-left: 15px;
  background-color: var(--navbar-wrapper);
  z-index: 999;

  /*  轉場動畫  */
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 0.3s ease-out;
  opacity: 0;
}

.navbar-item {
  margin-right: 6px;
}

.burger-bar-wrapper img {
  width: 35px;
  height: 35px;
  object-fit: cover;
}

.search-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
}

.search-wrapper .form-control {
  width: 90px;
}

.search-list {
  position: absolute;
  top: 35px;
  width: 90px;
  z-index: 999;
  padding: 3px 12px;
  border: 2px solid rgb(34, 92, 178);
  border-radius: 5px;
  background-color: var(--search-list);
}

.search-list-item {
  margin: 8px 0px;
  cursor: pointer;
}

.user-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.user-wrapper .navbar-item {
  max-width: 40px;
  margin-right: 3px;
}

.user-wrapper .btn {
  padding: 2px 3px;
}

/* dark mode switch */
.darkmode_label {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 40px;
  width: 30px;
  padding-left: 3px;
}

.darkmode_label img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.darkmode_input {
  display: none;
}

/* dark mode switch */

/* Small devices (landscape phones, 374px and down) */
@media (min-width: 375px) {
  .search-wrapper .form-control {
    width: 145px;
  }

  .search-list {
    width: 145px;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .navbar-container-right {
    padding-right: 30px;
  }

  .search-wrapper .form-control {
    width: 175px;
  }

  .search-list {
    width: 175px;
  }

  .navbar-item {
    margin-right: 1rem;
  }

  .user-wrapper .navbar-item {
    max-width: 80px;
    margin-right: 1rem;
  }

  .user-wrapper .btn {
    padding: 6px 9px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .navbar-wrapper {
    position: relative;
    /*  轉場動畫  */
    transform: scale(1, 1);
    transform-origin: top;
    transition: transform 0.3s ease-out;
    opacity: 1;
  }

  .burger-bar-wrapper img {
    /*不佔空間*/
    position: absolute;
    visibility: hidden;
    display: none;
  }

  .search-wrapper .form-control {
    width: 200px;
  }

  .search-list {
    width: 200px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {}
</style>