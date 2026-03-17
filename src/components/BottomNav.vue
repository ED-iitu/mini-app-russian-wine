<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: route.name === 'catalog' }">
      <span class="nav-icon">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" stroke="currentColor" stroke-width="1.8"/>
          <path d="M9 10h6M9 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8 4v16" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      </span>
      <span class="nav-label">Каталог</span>
    </router-link>

    <router-link to="/cart" class="nav-item" :class="{ active: route.name === 'cart' || route.name === 'checkout' }">
      <span class="nav-icon">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M3 6h18" stroke="currentColor" stroke-width="1.8"/>
          <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span v-if="cartCount > 0" class="badge">{{ cartCount > 9 ? '9+' : cartCount }}</span>
      </span>
      <span class="nav-label">Корзина</span>
    </router-link>

    <router-link to="/profile" class="nav-item" :class="{ active: route.name === 'profile' }">
      <span class="nav-icon">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="nav-label">Профиль</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cart = useCartStore()
const cartCount = computed(() => cart.totalCount)
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--nav-h) + var(--safe-bottom));
  background: var(--bg-modal);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  padding-top: 8px;
  padding-bottom: var(--safe-bottom);
  z-index: 50;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-dim);
  padding: 6px 0;
  transition: color 0.2s;
}

.nav-item.active {
  color: var(--accent);
}

.nav-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}

.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}
</style>
