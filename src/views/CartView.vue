<template>
  <div class="page">
    <div class="page-header">
      <h1>Корзина</h1>
      <p class="subtitle" v-if="cart.items.length">{{ cart.totalCount }} {{ plural(cart.totalCount, 'позиция', 'позиции', 'позиций') }}</p>
    </div>

    <!-- Empty state -->
    <div v-if="cart.items.length === 0" class="empty-state">
      <div class="icon">🛒</div>
      <h3>Корзина пуста</h3>
      <p>Добавьте вина из каталога, чтобы оформить заказ</p>
      <router-link to="/" class="btn btn-primary" style="margin-top:8px">
        Перейти в каталог
      </router-link>
    </div>

    <!-- Cart items -->
    <div v-else>
      <div class="cart-list">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <div class="cart-item__img-wrap">
            <img
              v-if="item.image"
              :src="getImageUrl(item.image)"
              :alt="item.title"
              class="cart-item__img"
              @error="$event.target.style.display='none'"
            />
            <div v-else class="cart-item__img-placeholder">🍷</div>
          </div>

          <div class="cart-item__info">
            <h4 class="cart-item__title">{{ item.title }}</h4>
            <p class="cart-item__model">{{ item.model }}</p>
            <div class="cart-item__bottom">
              <span class="price-sm">{{ formatPrice(item.price * item.quantity) }} ₽</span>
              <div class="qty-control">
                <button class="qty-btn" @click="cart.updateQty(item.id, item.quantity - 1)">−</button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button class="qty-btn" @click="cart.updateQty(item.id, item.quantity + 1)">+</button>
              </div>
            </div>
          </div>

          <button class="remove-btn" @click="cart.removeItem(item.id)">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div class="cart-summary">
        <div class="summary-row">
          <span>Товаров</span>
          <span>{{ cart.totalCount }} шт.</span>
        </div>
        <div class="summary-row total">
          <span>Итого</span>
          <span class="price">{{ formatPrice(cart.totalPrice) }} ₽</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="cart-cta">
        <router-link to="/checkout" class="btn btn-primary btn-full">
          Оформить заказ
        </router-link>
        <button class="btn btn-ghost btn-full" @click="cart.clear()">
          Очистить корзину
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { getImageUrl } from '../api'

const cart = useCartStore()

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function plural(n, one, few, many) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
</script>

<style scoped>
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 16px;
  margin-top: 12px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.cart-item__img-wrap {
  width: 52px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid var(--border);
}

.cart-item__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.cart-item__img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.cart-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-right: 28px;
}

.cart-item__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}

.cart-item__model {
  font-size: 12px;
  color: var(--text-dim);
}

.cart-item__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.remove-btn {
  position: absolute;
  top: 14px;
  right: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.15s;
}
.remove-btn:active { color: var(--accent-light); }

.cart-summary {
  margin: 16px 16px 0;
  padding: 16px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-muted);
}

.summary-row.total {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.cart-cta {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
