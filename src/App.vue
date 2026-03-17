<template>
  <div class="app-root">
    <router-view v-slot="{ Component, route }">
      <transition name="fade">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
    <BottomNav />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BottomNav from './components/BottomNav.vue'
import Toast from './components/Toast.vue'

onMounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#f2ebe0')
    tg.setBackgroundColor?.('#f2ebe0')
  }
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
