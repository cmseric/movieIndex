import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import axios from 'axios'
import '@/global'
import IndexPage from '../pages/index'
import RobotTest from '@/components/RobotTest'
import MoviesList from '../pages/moviesList'
import MovieDetail from '../pages/movieDetail'
import NewsDetail from '../pages/newsDetail'
import LoginPage from '../pages/loginPage'
import RegisterPage from '../pages/registerPage'
import FindPassword from '../pages/findPassword'
import UserInfo from '../pages/userInfo'
import SendEmail from '../pages/sendEmail'

Vue.use(Router)
Vue.use(VueResource)
Vue.use(axios)

// Vue.prototype.$http = axios

export default new Router({
  routes: [
    {
      path: '/',
      component: IndexPage,
      meta: {
        title: 'home'
      }
    },
    {
      path: '/RobotTest',
      component: RobotTest
    },
    {
      path: '/moviesList',
      component: MoviesList
    },
    {
      path: '/movieDetail',
      component: MovieDetail
    },
    {
      path: '/newsDetail',
      component: NewsDetail
    },
    {
      path: '/loginPage',
      component: LoginPage
    },
    {
      path: '/registerPage',
      component: RegisterPage
    },
    {
      path: '/findPassword',
      component: FindPassword
    },
    {
      path: '/userInfo',
      component: UserInfo
    },
    {
      path: '/sendEmail',
      component: SendEmail
    }
  ]
})
