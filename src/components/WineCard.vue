<template>
  <div class="wine-card" @click="$router.push(`/wine/${wine.id}`)">
    <!-- Image zone -->
    <div class="wine-card__img-wrap">
      <img
        v-if="imgUrl"
        :src="imgUrl"
        :alt="wine.title"
        class="wine-card__img"
        loading="lazy"
        @error="imgUrl = null"
      />
      <div v-else class="wine-card__placeholder">🍷</div>

      <!-- gradient fade into card body -->
      <div class="wine-card__fade" />

      <!-- color badge top-left -->
      <span v-if="wine.color" class="wine-card__color-badge">
        <span class="color-dot" :style="{ background: colorHex(wine.color.title) }" />
        {{ wine.color.title }}
      </span>
    </div>

    <!-- Info overlaid at bottom via absolute, sits on the fade -->
    <div class="wine-card__body">
      <h3 class="wine-card__title">{{ wine.title }}</h3>
      <p v-if="wine.winery" class="wine-card__winery">{{ wine.winery.title }}</p>
      <div class="wine-card__footer">
        <span class="wine-card__price">{{ formatPrice(wine.price) }} ₽</span>
        <button class="wine-card__add" @click.stop="handleAdd">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getImageUrl } from '../api'
import { useCartStore } from '../stores/cart'

const props = defineProps({ wine: Object })
const cart = useCartStore()
const imgUrl = ref(getImageUrl(props.wine.image))

function handleAdd() {
  cart.addItem(props.wine)
  window.__showToast?.('Добавлено в корзину 🛒')
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
}

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function colorHex(title) {
  const map = {
    'Красное': '#c0392b',
    'Белое': '#c9a84c',
    'Розовое': '#d4698a',
    'Оранжевое': '#c87941',
    'Игристое': '#6a9cbf',
  }
  const key = Object.keys(map).find(k => title?.includes(k.slice(0, 3)))
  return key ? map[key] : '#888'
}
</script>

<style scoped>
.wine-card {
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.18s;
  background: var(--bg-card);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}
.wine-card:active { transform: scale(0.96); }

/* ── Image ── */
.wine-card__img-wrap {
  position: relative;
  aspect-ratio: 3/4;
  background: #ffffff;
  overflow: hidden;
  border-radius: 0;
}

.wine-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 10px 8px 0;
}

.wine-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}

/* нижний fade */
.wine-card__fade {
  display: none;
}

/* color badge */
.wine-card__color-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(10, 4, 6, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(245, 232, 211, 0.9);
  border: 1px solid rgba(255,255,255,0.1);
}

.color-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Body ── */
.wine-card__body {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  flex: 1;
}

.wine-card__title {
  font-size: 13px;
  font-weight: 700;
  color: #1a0a0f;
  line-height: 1.35;
  /* всегда ровно 2 строки — карточки одной высоты */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(13px * 1.35 * 2);
}

.wine-card__winery {
  font-size: 11px;
  color: #a08070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}

.wine-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
}

.wine-card__price {
  font-size: 15px;
  font-weight: 700;
  color: #8b5c1a;
  letter-spacing: -0.3px;
}

.wine-card__add {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(192, 57, 43, 0.45);
  transition: all 0.15s;
  flex-shrink: 0;
}
.wine-card__add:active { transform: scale(0.88); background: var(--accent-light); }
</style>
