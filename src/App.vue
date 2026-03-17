<template>
  <div class="app-root">
    <router-view />
    <BottomNav />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import Toast from './components/Toast.vue'
import { useWinesStore } from './stores/wines'

const route = useRoute()

onMounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#f2ebe0')
    tg.setBackgroundColor?.('#f2ebe0')
  }

  // Временный дебаг — удалим после диагностики
  const d = document.createElement('div')
  d.style = 'position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:9999;padding:8px;font-size:11px;word-break:break-all'
  d.textContent = `PATH:${location.pathname} HASH:${location.hash} ROUTE:${route.name || 'NONE'} MATCHED:${route.matched.length}`
  document.body.appendChild(d)
  setTimeout(() => d.remove(), 8000)

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
