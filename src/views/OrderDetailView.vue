<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <h1>Заказ #{{ order.id }}</h1>
    </div>

    <div class="order-meta card-block">
      <div class="meta-row">
        <span class="meta-label">Дата</span>
        <span class="meta-val">{{ order.date }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Позиций</span>
        <span class="meta-val">{{ order.items_count }} шт.</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Итого</span>
        <span class="meta-val total">{{ order.total.toLocaleString('ru') }} ₽</span>
      </div>
    </div>

    <div class="section-title">Состав заказа</div>

    <div v-if="order.items && order.items.length" class="items-list card-block">
      <div v-for="(item, i) in order.items" :key="i" class="item-row">
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-qty">{{ item.qty }} шт. × {{ item.price.toLocaleString('ru') }} ₽</div>
        </div>
        <div class="item-total">{{ (item.price * item.qty).toLocaleString('ru') }} ₽</div>
      </div>
    </div>

    <div v-else class="orders-empty">Данные о составе заказа недоступны</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const order = computed(() => {
  const state = history.state?.order
  if (state) return state
  return { id: route.params.id, date: '—', total: 0, items_count: 0, items: [] }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: -4px;
}

.card-block {
  margin: 0 16px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.order-meta {
  margin-top: 12px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.meta-row:last-child { border-bottom: none; }

.meta-label {
  font-size: 14px;
  color: var(--text-muted);
}

.meta-val {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.meta-val.total {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent2);
}

.items-list { margin-bottom: 16px; }

.item-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.item-row:last-child { border-bottom: none; }

.item-info { flex: 1; }

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.3;
}

.item-qty {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.item-total {
  font-size: 15px;
  font-weight: 700;
  color: var(--gold-light);
  white-space: nowrap;
  flex-shrink: 0;
}

.orders-empty {
  margin: 0 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
}
</style>
