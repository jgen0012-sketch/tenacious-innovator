import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'SensoryPath – Home' }
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
    meta: { title: 'SensoryPath – Live Map' }
  },
  {
    path: '/route',
    name: 'Route',
    component: () => import('@/views/RouteView.vue'),
    meta: { title: 'SensoryPath – Plan Route' }
  },
  {
    path: '/refuges',
    name: 'Refuges',
    component: () => import('@/views/RefugesView.vue'),
    meta: { title: 'SensoryPath – Quiet Spaces' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'SensoryPath – My Profile' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = to.meta?.title || 'SensoryPath'
})

export default router
