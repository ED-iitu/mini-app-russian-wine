<template>
  <div class="page" v-if="wine">
    <!-- Back button header -->
    <div class="detail-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="detail-header__title">{{ wine.title }}</span>
      <div style="width:40px" />
    </div>

    <!-- Image -->
    <div class="detail-img-wrap">
      <img
        v-if="imgUrl"
        :src="imgUrl"
        :alt="wine.title"
        class="detail-img"
        @error="imgUrl = null"
      />
      <div v-else class="detail-img-placeholder">🍷</div>
    </div>

    <!-- Content -->
    <div class="detail-content">
      <!-- Winery -->
      <p v-if="wine.winery" class="detail-winery">{{ wine.winery.title }}</p>

      <!-- Title -->
      <h1 class="detail-title">{{ wine.title }}</h1>

      <!-- Price row -->
      <div class="detail-price-row">
        <span class="detail-price">{{ formatPrice(wine.price) }} ₽</span>
        <div class="detail-price-meta">
          <span v-if="wine.volume" class="detail-meta-tag">{{ wine.volume }} л</span>
          <span v-if="wine.year" class="detail-meta-tag">{{ wine.year }} г.</span>
        </div>
      </div>

      <!-- Tags row -->
      <div class="detail-tags">
        <span v-if="wine.color" class="tag">
          <span class="color-dot" :style="{ background: colorHex(wine.color?.title) }" />
          {{ wine.color.title }}
        </span>
        <span v-if="wine.sugar" class="tag">{{ wine.sugar.title }}</span>
        <span v-if="wine.fortress" class="tag">{{ wine.fortress }}% алк.</span>
        <span v-if="wine.region" class="tag">📍 {{ wine.region.title }}</span>
      </div>

      <!-- Specs grid -->
      <div class="detail-specs">
        <div v-if="wine.model" class="spec-item">
          <span class="spec-label">Артикул</span>
          <span class="spec-val">{{ wine.model }}</span>
        </div>
        <div v-if="wine.winery" class="spec-item">
          <span class="spec-label">Хозяйство</span>
          <span class="spec-val">{{ wine.winery.title }}</span>
        </div>
        <div v-if="wine.manufacture" class="spec-item">
          <span class="spec-label">Производитель</span>
          <span class="spec-val">{{ wine.manufacture.title }}</span>
        </div>
        <div v-if="wine.region" class="spec-item">
          <span class="spec-label">Регион</span>
          <span class="spec-val">{{ wine.region.title }}</span>
        </div>
        <div v-if="wine.fortress" class="spec-item">
          <span class="spec-label">Крепость</span>
          <span class="spec-val">{{ wine.fortress }}%</span>
        </div>
        <div v-if="wine.volume" class="spec-item">
          <span class="spec-label">Объём</span>
          <span class="spec-val">{{ wine.volume }} л</span>
        </div>
        <div v-if="wine.year" class="spec-item">
          <span class="spec-label">Год</span>
          <span class="spec-val">{{ wine.year }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="wine.description" class="detail-section">
        <div class="section-title" style="padding:0 0 8px">Описание</div>
        <p class="detail-desc" v-html="wine.description" />
      </div>

      <div v-if="wine.combination" class="detail-section">
        <div class="section-title" style="padding:0 0 8px">Сочетание</div>
        <p class="detail-desc" v-html="wine.combination" />
      </div>

      <div v-if="wine.feature" class="detail-section">
        <div class="section-title" style="padding:0 0 8px">Особенности</div>
        <p class="detail-desc" v-html="wine.feature" />
      </div>

      <div style="height: 100px" />
    </div>

    <!-- Bottom CTA -->
    <div class="detail-cta">
      <div class="qty-control">
        <button class="qty-btn" @click="qty > 1 ? qty-- : null">−</button>
        <span class="qty-val">{{ qty }}</span>
        <button class="qty-btn" @click="qty++">+</button>
      </div>
      <button class="btn btn-primary" style="flex:1" @click="addToCart">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          <path d="M16 10a4 4 0 0 1-8 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        В корзину · {{ formatPrice(wine.price * qty) }} ₽
      </button>
    </div>
  </div>

  <div v-else-if="loading" class="page loader-center">
    <div class="spinner" />
  </div>

  <div v-else class="page empty-state">
    <div class="icon">😕</div>
    <h3>Вино не найдено</h3>
    <button class="btn btn-ghost" @click="$router.push('/')">На главную</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { winesApi, getImageUrl } from '../api'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const wine = ref(null)
const loading = ref(true)
const qty = ref(1)
const imgUrl = ref(null)

const tg = window.Telegram?.WebApp
const backHandler = () => goBack()

onMounted(async () => {
  try {
    const { data } = await winesApi.getOne(route.params.id)
    wine.value = data
    imgUrl.value = getImageUrl(data.image)
  } finally {
    loading.value = false
  }

  if (tg) {
    tg.BackButton.show()
    tg.BackButton.onClick(backHandler)
  }
})

onUnmounted(() => {
  if (tg) {
    tg.BackButton.offClick(backHandler)
    tg.BackButton.hide()
  }
})

function goBack() {
  router.back()
}

function addToCart() {
  for (let i = 0; i < qty.value; i++) {
    cart.addItem(wine.value)
  }
  window.__showToast?.(`Добавлено ${qty.value} шт. в корзину 🛒`)
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
}

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function colorHex(title) {
  const map = { 'Красное': '#8b1a2e', 'Белое': '#d4b86a', 'Розовое': '#d4698a', 'Оранжевое': '#c87941', 'Игристое': '#6a9cbf' }
  const key = Object.keys(map).find(k => title?.includes(k.slice(0,3)))
  return key ? map[key] : '#888'
}
</script>

<style scoped>
.detail-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.back-btn:active { transform: scale(0.93); }

.detail-header__title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-img-wrap {
  width: 100%;
  height: 340px;
  overflow: hidden;
  background: #ffffff;
  position: relative;
}

.detail-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 12px 40px;
}

.detail-img-placeholder {
  width: 100%;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  background: #ffffff;
}

.detail-content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-winery {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
}

.detail-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.detail-price {
  font-size: 26px;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: -0.5px;
}

.detail-price-meta {
  display: flex;
  gap: 6px;
}

.detail-meta-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-specs {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.spec-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.spec-item:last-child { border-bottom: none; }

.spec-label {
  font-size: 14px;
  color: var(--text-muted);
}

.spec-val {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  text-align: right;
  max-width: 60%;
}

.detail-section {
  display: flex;
  flex-direction: column;
}

.detail-desc {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}
.detail-desc :deep(p) {
  margin: 0;
}
.detail-desc :deep(p + p) {
  margin-top: 8px;
}

/* CTA bar */
.detail-cta {
  position: fixed;
  bottom: calc(var(--nav-h) + var(--safe-bottom));
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg);
  border-top: 1px solid var(--border);
  z-index: 20;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
