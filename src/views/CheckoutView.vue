<template>
  <div class="page">
    <!-- Header -->
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="detail-header__title">Оформление заказа</span>
      <div style="width:40px"/>
    </div>

    <!-- Success screen -->
    <div v-if="success" class="success-screen">
      <div class="success-icon">🎉</div>
      <h2>Заказ принят!</h2>
      <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
      <div class="success-order-id">Заказ #{{ orderId }}</div>
      <button class="btn btn-primary btn-full" @click="goHome" style="margin-top:24px">
        Вернуться в каталог
      </button>
    </div>

    <!-- Form -->
    <div v-else class="checkout-content">
      <!-- Order summary -->
      <div class="section-title">Ваш заказ ({{ cart.totalCount }} позиций)</div>
      <div class="order-items">
        <div v-for="item in cart.items" :key="item.id" class="order-item">
          <span class="order-item__name">{{ item.title }}</span>
          <span class="order-item__qty">× {{ item.quantity }}</span>
          <span class="price-sm">{{ formatPrice(item.price * item.quantity) }} ₽</span>
        </div>
        <div class="order-total">
          <span>Итого:</span>
          <span class="price">{{ formatPrice(cart.totalPrice) }} ₽</span>
        </div>
      </div>

      <!-- Contact form -->
      <div class="section-title" style="margin-top:8px">Контактные данные</div>
      <div class="form-card">
        <div class="input-group">
          <label>Ваше имя *</label>
          <input v-model="form.name" type="text" placeholder="Иван Иванов" autocomplete="name" />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>
        <div class="input-group">
          <label>Телефон *</label>
          <input v-model="form.phone" type="tel" placeholder="+7 900 000 00 00" autocomplete="tel" />
          <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
        </div>
        <div class="input-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" placeholder="ivan@example.com" autocomplete="email" />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>
      </div>

      <!-- Note -->
      <div class="checkout-note">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 8v5M12 16v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Менеджер свяжется с вами для подтверждения заказа и организации доставки</span>
      </div>

      <!-- Submit -->
      <div class="checkout-footer">
        <button class="btn btn-primary btn-full" :disabled="submitting" @click="submit">
          <span v-if="submitting">
            <div class="spinner" style="width:18px;height:18px;border-width:2px;display:inline-block" />
          </span>
          <span v-else>Отправить заказ · {{ formatPrice(cart.totalPrice) }} ₽</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { orderApi } from '../api'

const router = useRouter()
const cart = useCartStore()

const form = ref({ name: '', phone: '', email: '' })
const errors = ref({})
const submitting = ref(false)
const success = ref(false)
const orderId = ref(null)

// Pre-fill from Telegram if available
const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
if (tgUser) {
  form.value.name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ')
}

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Введите имя'
  if (!form.value.phone.trim()) errors.value.phone = 'Введите телефон'
  if (!form.value.email.trim()) errors.value.email = 'Введите email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Некорректный email'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    const payload = {
      name: form.value.name,
      phone: form.value.phone,
      email: form.value.email,
      total: cart.totalPrice,
      telegram_chat_id: tgId ?? null,
      items: cart.items.map(i => ({
        id: i.id,
        title: i.title,
        model: i.model,
        price: i.price,
        quantity: i.quantity
      }))
    }
    const { data } = await orderApi.create(payload)
    orderId.value = data.order_id || '—'
    success.value = true
    cart.clear()
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success')
  } catch (e) {
    window.__showToast?.('Ошибка при отправке заказа. Попробуйте ещё раз.')
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error')
  } finally {
    submitting.value = false
  }
}

function goHome() {
  router.push('/')
}

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
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
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.checkout-content {
  padding: 0 16px 120px;
}

.order-items {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 8px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.order-item__name {
  flex: 1;
  font-size: 14px;
  color: var(--text);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-item__qty {
  font-size: 13px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 8px;
}

.field-error {
  font-size: 12px;
  color: var(--accent-light);
  margin-top: 2px;
}

.checkout-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  background: rgba(201,168,76,0.08);
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: var(--radius-sm);
  color: var(--gold-light);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
}
.checkout-note svg { flex-shrink: 0; margin-top: 2px; }

.checkout-footer {
  position: fixed;
  bottom: calc(var(--nav-h) + var(--safe-bottom));
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}

/* Success */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 32px;
  gap: 16px;
}

.success-icon { font-size: 72px; }

.success-screen h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
}

.success-screen p {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

.success-order-id {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
