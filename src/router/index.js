import Vue from 'vue'
import Router from 'vue-router'

const LuckyScroll = () => import('@/pages/luckyscroll')

Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'LuckyScroll',
      component: LuckyScroll
    },
    
    // {
    //   path: '/act/luckyScroll',
    //   name: 'LuckyScroll',
    //   component: LuckyScroll
    // },
  ]
})
