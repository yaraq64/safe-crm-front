import { createRouter, createWebHistory } from 'vue-router'
import userStore from '@/store/user'
import CheckUserAccess from '@/plugins/CheckUserAccess'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/OrdersView.vue')
  },
  {
    path: '/order/:id',
    name: 'orderPage',
    component: () => import('../views/OrderPageView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/directories',
    name: 'directories',
    component: () => import('../views/DirectoriesView.vue')
  },
  {
    path: '/work-schedule',
    name: 'workSchedule',
    component: () => import('../views/WorkScheduleView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const redirect = CheckUserAccess(
    {
      userRole: userStore.getters.userRole,
      loggedIn: userStore.getters.loggedIn,
      userLoaded: userStore.getters.loaded
    },
    to.name
  )

  next(redirect)
})

export default router
