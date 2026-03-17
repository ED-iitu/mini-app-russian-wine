import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'

const routes = [
  {
    path: '/',
    name: 'catalog',
    component: CatalogView
  },
  {
    path: '/wine/:id',
    name: 'wine',
    component: () => import('../views/WineDetailView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/order/:id',
    name: 'order',
    component: () => import('../views/OrderDetailView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
