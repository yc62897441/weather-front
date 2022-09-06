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
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Signin.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  },
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.isFetchDatasetOneWeek) {
    console.log('beforeEach dispatch fetchDatasetOneWeek', )
    store.state.isFetchDatasetOneWeek = await store.dispatch('fetchDatasetOneWeek')
  }
  if (!store.state.isFetchDatasetPerThreeHours) {
    console.log('beforeEach dispatch fetchDatasetPerThreeHours',)
    store.state.isFetchDatasetPerThreeHours = await store.dispatch('fetchDatasetPerThreeHours')
  }
  next()
})

export default router
