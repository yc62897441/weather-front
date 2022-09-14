import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/weatherFilter',
    name: 'weatherFilter',
    component: () => import('../views/WeatherFilter.vue')
  },
  {
    path: '/weatherMap',
    name: 'weatherMap',
    component: () => import('../views/WeatherMap.vue')
  },
  {
    path: '/mountain/:id',
    name: 'mountain',
    component: () => import('../views/Mountain.vue')
  },
  {
    path: '/user/save',
    name: 'usersave',
    component: () => import('../views/UserSave.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Signin.vue')
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  // },
  {
    path: '*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "about" */ '../views/NotFound.vue')
  },
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // 從 localStorage 取出 token，從 vuex 取出 token
  // 如果有登入了，兩者都會有東西
  const token = localStorage.getItem('token')
  const tokenInStore = store.state.token
  let currentUser = store.state.currentUser

  // 如果有登入了，store.state.isAuthenticated 會是 true
  let isAuthenticated = store.state.isAuthenticated

  // 如果 localStorage 有 token，且跟 vuex 的 token 一致時，跳過以下步驟，不須重新檢查  localStorage 的 token 是否還正確
  // 如果 localStorage 有 token，但 token 跟存在 vuex 的 token 不一致時，要重新檢查 localStorage 的 token 是否還正確
  // fetchCurrentUser() 會攜帶 localStorage 的 token 向後端 getCurrentUser()，藉此檢查 localStorage 的 token
  // 如果 localStorage 的 token 還是有效，isAuthenticated = true 否則為 false
  if (token && (token !== tokenInStore)) {
    // 取得驗證成功與否 fetchCurrentUser() 回傳 true or false
    isAuthenticated = await store.dispatch('fetchCurrentUser')
    currentUser = store.state.currentUser
  }

  // 如果 isAuthenticated 為 false，且進入需要驗證的頁面，則轉址到登入頁
  const pathWithAuth = ['usersave']
  if (!isAuthenticated && pathWithAuth.includes(to.name)) {
    next('/signin')
    return
  }

  if (!store.state.isFetchDatasetOneWeek) {
    store.state.isFetchDatasetOneWeek = await store.dispatch('fetchDatasetOneWeek')
  }
  if (!store.state.isFetchDatasetPerThreeHours) {
    store.state.isFetchDatasetPerThreeHours = await store.dispatch('fetchDatasetPerThreeHours')
  }
  next()
})

export default router
