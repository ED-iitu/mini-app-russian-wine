<template>
  <div class="page" ref="pageRef">
    <div class="page-header">
      <div class="catalog-header">
        <div>
          <h1>Каталог вин</h1>
          <p class="subtitle" v-if="store.pagination">
            <template v-if="store.searchQuery">
              {{ store.displayWines.length }} результатов
            </template>
            <template v-else>
              {{ store.wines.length }} из {{ store.pagination.total }}
            </template>
          </p>
        </div>
        <button class="filter-btn" :class="{ 'has-filters': store.activeCount > 0 }" @click="showFilters = true">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-if="store.activeCount > 0" class="filter-count">{{ store.activeCount }}</span>
        </button>
      </div>

      <!-- Search bar -->
      <div class="search-wrap" :class="{ focused: searchFocused }">
        <svg class="search-icon" width="17" height="17" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
          <path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="store.searchQuery"
          class="search-input"
          type="search"
          placeholder="Поиск по винам и винодельням"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
          @input="onSearchInput"
        />
        <button v-if="store.searchQuery" class="search-clear" @click="clearSearch">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Active filter chips -->
      <div v-if="hasAnyActiveFilter" class="active-filters">
        <button v-for="(val, key) in store.activeFilters" :key="key"
          class="chip active" @click="removeServerFilter(key)">
          {{ filterLabel(key, val) }}
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button v-if="store.priceRange" class="chip active" @click="store.priceRange = null">
          {{ priceLabel(store.priceRange) }}
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button v-if="store.sortBy" class="chip active" @click="store.sortBy = null">
          {{ store.sortBy === 'price_asc' ? '↑ Цена' : '↓ Цена' }}
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="wine-grid">
      <WineCard v-for="wine in store.displayWines" :key="wine.id" :wine="wine" />
    </div>

    <div v-if="store.loading" class="loader-center">
      <div class="spinner" />
    </div>

    <div v-if="!store.loading && store.displayWines.length === 0" class="empty-state">
      <div class="icon">🍾</div>
      <h3>Ничего не найдено</h3>
      <p>Попробуйте другой запрос или сбросьте фильтры</p>
      <button class="btn btn-ghost" @click="resetAll" style="margin-top:8px">Сбросить всё</button>
    </div>

    <div ref="sentinel" style="height:1px" />
  </div>

  <FilterDrawer v-model="showFilters" @apply="onFiltersApply" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useWinesStore } from '../stores/wines'
import WineCard from '../components/WineCard.vue'
import FilterDrawer from '../components/FilterDrawer.vue'

const store = useWinesStore()
const pageRef = ref(null)
const sentinel = ref(null)
const showFilters = ref(false)
const searchFocused = ref(false)

let searchTimer = null

const hasAnyActiveFilter = computed(() =>
  Object.keys(store.activeFilters).length > 0 || store.priceRange || store.sortBy
)

onMounted(async () => {
  if (store.wines.length === 0 && !store.loading) {
    await store.loadWines(true)
    store.loadFilters()
  }
  setupObserver()
})

watch(() => store.wines.length, (len) => {
  if (len > 0 && !observer) setupObserver()
})

let observer = null
function setupObserver() {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && store.hasMore && !store.loading) {
      store.loadWines()
    }
  }, { root: pageRef.value, threshold: 0.1 })
  if (sentinel.value) observer.observe(sentinel.value)
}
onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(searchTimer)
})

function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    store.loadWines(true)
  }, 400)
}

function clearSearch() {
  store.searchQuery = ''
  clearTimeout(searchTimer)
  store.loadWines(true)
}

function onFiltersApply() {
  store.searchQuery = ''
  store.loadWines(true)
}

function removeServerFilter(key) {
  store.setFilter(key, null)
  store.loadWines(true)
}

function resetAll() {
  store.clearFilters()
  store.loadWines(true)
}

function filterLabel(key, val) {
  const f = store.filters
  if (!f) return val
  const maps = { color_id: f.colors, sugar_id: f.sugars, region_id: f.regions, sort_id: f.sorts, class_id: f.classes, winery_id: f.wineries }
  if (key === 'year')     return `${val} г.`
  if (key === 'fortress') return `${val}% алк.`
  if (maps[key])          return maps[key].find(i => i.id === val)?.title || val
  return val
}

function priceLabel(r) {
  if (!r) return ''
  if (r.max === Infinity) return `от ${r.min.toLocaleString('ru')} ₽`
  if (r.min === 0)        return `до ${r.max.toLocaleString('ru')} ₽`
  return `${r.min.toLocaleString('ru')}–${r.max.toLocaleString('ru')} ₽`
}
</script>

<style scoped>
.catalog-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 10px;
}

/* Search */
.search-wrap {
  display: flex; align-items: center;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 0 12px;
  transition: border-color 0.2s;
  gap: 8px;
}
.search-wrap.focused { border-color: var(--accent); }

.search-icon { color: var(--text-dim); flex-shrink: 0; }


.search-input {
  flex: 1; height: 42px;
  background: transparent; border: none; outline: none;
  font-size: 15px; color: var(--text);
  -webkit-appearance: none; min-width: 0;
}
.search-input::placeholder { color: var(--text-dim); }
.search-input::-webkit-search-cancel-button { display: none; }

.search-clear {
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; padding: 4px; display: flex; align-items: center; flex-shrink: 0;
}

/* Loading bar */
.search-loading-bar {
  display: flex; align-items: center; gap: 10px;
  margin: 0 12px 8px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 13px; color: var(--text-muted);
  overflow: hidden;
  position: relative;
}

.search-loading-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, rgba(192,57,43,0.08), transparent);
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* Filter button */
.filter-btn {
  position: relative; width: 42px; height: 42px;
  border-radius: 12px; background: var(--bg-card);
  border: 1.5px solid var(--border); color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.filter-btn:active { transform: scale(0.93); }
.filter-btn.has-filters {
  border-color: var(--accent); color: var(--accent);
  background: rgba(192,57,43,0.08);
}
.filter-count {
  position: absolute; top: -5px; right: -5px;
  background: var(--accent); color: white;
  font-size: 10px; font-weight: 700;
  min-width: 17px; height: 17px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

.active-filters {
  display: flex; gap: 6px; overflow-x: auto;
  padding-top: 10px; scrollbar-width: none;
}
.active-filters::-webkit-scrollbar { display: none; }

.chip.active {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 20px;
  border: 1.5px solid var(--accent);
  background: rgba(192,57,43,0.08);
  color: var(--accent); font-size: 12px; font-weight: 600;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
}
.chip.active:active { transform: scale(0.95); }

.wine-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 10px; padding: 12px;
}
@media (min-width: 480px) {
  .wine-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
