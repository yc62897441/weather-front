<template>
  <div class="navbar-container">
    <div class="navbar-wrapper">
      <div class="navbar-item">
        <router-link class="link" to="/">
          天氣總覽表
        </router-link>
      </div>
      <div class="navbar-item">
        <router-link class="link" to="/weatherFilter">
          天氣條件檢索
        </router-link>
      </div>
      <div class="navbar-item">
        <router-link class="link" to="/weatherMap">
          天氣地圖
        </router-link>
      </div>
    </div>
    <div class="search-wrapper">
      <input type="text" placeholder="搜尋山岳" v-on:keyup.prevent.stop="searchMountain" v-model="input">
      <template v-if="input">
        <div class="search-list">
          <div class="search-list-item" v-for="item in searchMountainList" v-bind:key="item.id">
            <router-link class="link" v-bind:to="'/mountain/' + item.id"> {{ item.locationName }}</router-link>
          </div>
        </div>
      </template>
    </div>
    <div class="user-wrapper">
      <div v-if="isAuthenticated" v-on:click="signout" class="btn btn-danger">登出</div>
      <div v-else  class="btn btn-success">登入/註冊</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      input: '',
      searchMountainList: []
    }
  },
  computed: {
    ...mapState(['datasetOneWeek', 'currentUser', 'isAuthenticated'])
  },
  methods: {
    searchMountain() {
      if (this.input.length > 0) {
        this.searchMountainList = []
        this.datasetOneWeek.locations.location.map(locat => {
          if (locat.locationName.includes(this.input)) {
            console.log(this.input, locat.locationName)
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
    }
  }
}
</script>

<style>
.navbar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 50px;
  padding-left: 15px;
  background-color: #EEEEEE;
}

.navbar-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.navbar-item {
  margin-right: 1rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.search-list {
  position: absolute;
  top: 20px;
  z-index: 999;
  border: 2px solid firebrick;
  background-color: azure;
}

.search-list-item {
  margin: 3px 0px;
  cursor: pointer;
}
</style>