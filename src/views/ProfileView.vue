<template>
  <div class="page">
    <div class="page-header">
      <h1>Профиль</h1>
    </div>

    <!-- User card -->
    <div class="profile-hero">
      <div class="profile-avatar">
        <img v-if="tgUser?.photo_url" :src="tgUser.photo_url" alt="avatar" class="avatar-img" />
        <span v-else class="avatar-initials">{{ initials }}</span>
      </div>
      <div class="profile-info">
        <h2 class="profile-name">{{ fullName || 'Гость' }}</h2>
        <p class="profile-username">
          <span v-if="tgUser?.username">@{{ tgUser.username }}</span>
          <span v-else-if="tgUser">Telegram</span>
          <span v-else>Не авторизован</span>
        </p>
      </div>
    </div>

    <!-- About shop -->
    <div class="section-title">О магазине</div>
    <div class="info-cards">
      <a href="https://russianvine.ru" target="_blank" class="info-card">
        <span class="info-card__icon">🌐</span>
        <div class="info-card__text">
          <div class="info-card__label">Сайт</div>
          <div class="info-card__val">russianvine.ru</div>
        </div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </a>

      <div class="info-card">
        <span class="info-card__icon">📦</span>
        <div class="info-card__text">
          <div class="info-card__label">Доставка</div>
          <div class="info-card__val">По всей России</div>
        </div>
      </div>

      <div class="info-card">
        <span class="info-card__icon">🍷</span>
        <div class="info-card__text">
          <div class="info-card__label">Специализация</div>
          <div class="info-card__val">Русские вина</div>
        </div>
      </div>

      <a href="https://t.me/russianvine" target="_blank" class="info-card">
        <span class="info-card__icon">📞</span>
        <div class="info-card__text">
          <div class="info-card__label">Поддержка</div>
          <div class="info-card__val">@russianvine</div>
        </div>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </a>
    </div>

    <!-- How to order -->
    <div class="section-title" style="margin-top:8px">Как сделать заказ</div>
    <div class="steps-card">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">Выберите вина в каталоге и добавьте в корзину</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">Перейдите в корзину и оформите заказ</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">Дождитесь звонка менеджера для подтверждения</div>
      </div>
    </div>

    <!-- Age disclaimer -->
    <div class="age-disclaimer">
      <span class="age-badge">18+</span>
      <span>Продажа алкоголя разрешена лицам старше 18 лет</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

const fullName = computed(() => {
  if (!tgUser) return ''
  return [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ')
})

const initials = computed(() => {
  if (!tgUser) return '?'
  const f = tgUser.first_name?.[0] || ''
  const l = tgUser.last_name?.[0] || ''
  return (f + l).toUpperCase() || '?'
})
</script>

<style scoped>
.profile-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  margin: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.profile-username {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 3px;
}

.info-cards {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 0 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  cursor: default;
  transition: background 0.15s;
}
.info-card:last-child { border-bottom: none; }
a.info-card { cursor: pointer; }
a.info-card:active { background: var(--bg-card2); }

.info-card__icon { font-size: 22px; }

.info-card__text { flex: 1; }

.info-card__label {
  font-size: 12px;
  color: var(--text-muted);
}

.info-card__val {
  font-size: 15px;
  color: var(--text);
  font-weight: 500;
  margin-top: 2px;
}

.info-card svg { color: var(--text-dim); }

.steps-card {
  margin: 0 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent2);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-text {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
  padding-top: 4px;
}

.age-disclaimer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 16px 24px;
  padding: 12px 16px;
  background: rgba(139, 26, 46, 0.1);
  border: 1px solid rgba(139, 26, 46, 0.25);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
}

.age-badge {
  background: var(--accent2);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  flex-shrink: 0;
}
</style>
