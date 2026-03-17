<template>
  <div class="app-root">
    <router-view />
    <BottomNav />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BottomNav from './components/BottomNav.vue'
import Toast from './components/Toast.vue'
import { useWinesStore } from './stores/wines'

onMounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#f2ebe0')
    tg.setBackgroundColor?.('#f2ebe0')
  }

  const store = useWinesStore()
  store.loadWines(true)
  store.loadFilters()
})
</script>

<style>
.app-root {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
  position: relative;
}
</style>
