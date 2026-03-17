<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="overlay" @click="$emit('update:modelValue', false)" />
    </transition>
    <transition name="slide-up">
      <div v-if="modelValue" class="drawer">
        <div class="drawer-handle" />
        <div class="drawer-header">
          <span class="drawer-title">Фильтры</span>
          <button class="clear-btn" @click="clearAll">Сбросить всё</button>
        </div>

        <div v-if="filtersStore.filters" class="drawer-content">

          <!-- Сортировка -->
          <div class="filter-section">
            <div class="section-label">Сортировка</div>
            <div class="filter-grid">
              <button
                v-for="s in sortOptions" :key="s.val"
                class="filter-chip" :class="{ active: localSort === s.val }"
                @click="localSort = localSort === s.val ? null : s.val"
              >{{ s.label }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Цена -->
          <div class="filter-section">
            <div class="section-label">Цена</div>
            <div class="filter-grid">
              <button
                v-for="p in priceRanges" :key="p.label"
                class="filter-chip" :class="{ active: isPriceActive(p) }"
                @click="togglePrice(p)"
              >{{ p.label }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Цвет -->
          <div v-if="filtersStore.filters.colors?.length" class="filter-section">
            <div class="section-label">Цвет</div>
            <div class="filter-grid">
              <button
                v-for="c in filtersStore.filters.colors" :key="c.id"
                class="filter-chip" :class="{ active: local.color_id === c.id }"
                @click="toggle('color_id', c.id)"
              >
                <span class="color-dot" :style="{ background: colorHex(c.title) }" />
                {{ c.title }}
              </button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Сахар -->
          <div v-if="filtersStore.filters.sugars?.length" class="filter-section">
            <div class="section-label">Содержание сахара</div>
            <div class="filter-grid">
              <button
                v-for="s in filtersStore.filters.sugars" :key="s.id"
                class="filter-chip" :class="{ active: local.sugar_id === s.id }"
                @click="toggle('sugar_id', s.id)"
              >{{ s.title }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Регион -->
          <div v-if="filtersStore.filters.regions?.length" class="filter-section">
            <div class="section-label">Регион</div>
            <div class="filter-grid">
              <button
                v-for="r in filtersStore.filters.regions" :key="r.id"
                class="filter-chip" :class="{ active: local.region_id === r.id }"
                @click="toggle('region_id', r.id)"
              >{{ r.title }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Винодельня -->
          <div v-if="filtersStore.filters.wineries?.length" class="filter-section">
            <div class="section-label">Винодельня</div>
            <div class="filter-grid">
              <button
                v-for="w in filtersStore.filters.wineries" :key="w.id"
                class="filter-chip" :class="{ active: local.winery_id === w.id }"
                @click="toggle('winery_id', w.id)"
              >{{ w.title }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Сорт винограда -->
          <div v-if="filtersStore.filters.sorts?.length" class="filter-section">
            <div class="section-label">Сорт винограда</div>
            <div class="filter-grid">
              <button
                v-for="s in filtersStore.filters.sorts" :key="s.id"
                class="filter-chip" :class="{ active: local.sort_id === s.id }"
                @click="toggle('sort_id', s.id)"
              >{{ s.title }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Класс вина -->
          <div v-if="filtersStore.filters.classes?.length" class="filter-section">
            <div class="section-label">Класс вина</div>
            <div class="filter-grid">
              <button
                v-for="c in filtersStore.filters.classes" :key="c.id"
                class="filter-chip" :class="{ active: local.class_id === c.id }"
                @click="toggle('class_id', c.id)"
              >{{ c.title }}</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Крепость -->
          <div v-if="filtersStore.filters.fortresses?.length" class="filter-section">
            <div class="section-label">Крепость, %</div>
            <div class="filter-grid">
              <button
                v-for="f in filtersStore.filters.fortresses" :key="f.fortress"
                class="filter-chip" :class="{ active: local.fortress === f.fortress }"
                @click="toggle('fortress', f.fortress)"
              >{{ f.fortress }}%</button>
            </div>
          </div>

          <div class="divider-line" />

          <!-- Год урожая -->
          <div v-if="filtersStore.filters.years?.length" class="filter-section">
            <div class="section-label">Год урожая</div>
            <div class="filter-grid">
              <button
                v-for="y in filtersStore.filters.years" :key="y.year"
                class="filter-chip" :class="{ active: local.year === y.year }"
                @click="toggle('year', y.year)"
              >{{ y.year }}</button>
            </div>
          </div>

        </div>
        <div v-else class="loader-center"><div class="spinner" /></div>

        <div class="drawer-footer">
          <button class="btn btn-primary btn-full" @click="apply">
            Показать вина
            <span v-if="activeCount > 0" class="apply-count">{{ activeCount }}</span>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWinesStore } from '../stores/wines'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'apply'])

const filtersStore = useWinesStore()

const local = ref({})
const localPrice = ref(null)
const localSort = ref(null)

const sortOptions = [
  { val: 'price_asc',  label: '↑ Сначала дешевле' },
  { val: 'price_desc', label: '↓ Сначала дороже' },
]

const priceRanges = [
  { label: 'до 1 000 ₽',      min: 0,    max: 1000     },
  { label: '1 000 – 2 000 ₽', min: 1000, max: 2000     },
  { label: '2 000 – 4 000 ₽', min: 2000, max: 4000     },
  { label: '4 000 – 7 000 ₽', min: 4000, max: 7000     },
  { label: 'от 7 000 ₽',      min: 7000, max: Infinity  },
]

watch(() => props.modelValue, (v) => {
  if (v) {
    filtersStore.loadFilters()
    local.value    = { ...filtersStore.activeFilters }
    localPrice.value = filtersStore.priceRange ? { ...filtersStore.priceRange } : null
    localSort.value  = filtersStore.sortBy ?? null
  }
})

const activeCount = computed(() => {
  let n = Object.keys(local.value).length
  if (localPrice.value) n++
  if (localSort.value)  n++
  return n
})

function toggle(key, val) {
  const next = { ...local.value }
  if (next[key] === val) delete next[key]
  else next[key] = val
  local.value = next
}

function togglePrice(p) {
  localPrice.value = isPriceActive(p) ? null : { min: p.min, max: p.max }
}

function isPriceActive(p) {
  return localPrice.value?.min === p.min && localPrice.value?.max === p.max
}

function clearAll() {
  local.value      = {}
  localPrice.value = null
  localSort.value  = null
}

function apply() {
  // Серверные фильтры
  filtersStore.clearFilters()
  Object.entries(local.value).forEach(([k, v]) => filtersStore.setFilter(k, v))
  // Клиентские
  filtersStore.priceRange = localPrice.value
  filtersStore.sortBy     = localSort.value
  emit('update:modelValue', false)
  emit('apply')
}

function colorHex(title) {
  const map = { 'Красное': '#c0392b', 'Белое': '#d4b86a', 'Розовое': '#d4698a', 'Оранжевое': '#c87941', 'Игристое': '#6a9cbf' }
  const key = Object.keys(map).find(k => title?.includes(k.slice(0, 3)))
  return key ? map[key] : '#aaa'
}
</script>

<style scoped>
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
}
.drawer-title { font-size: 18px; font-weight: 700; color: var(--text); }
.clear-btn {
  background: none; border: none;
  color: var(--accent); font-size: 14px; font-weight: 500; cursor: pointer; padding: 4px;
}

.drawer-content { padding: 0 16px; }

.filter-section { padding: 14px 0 6px; }

.section-label {
  font-size: 12px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;
}

.filter-grid { display: flex; flex-wrap: wrap; gap: 8px; }

.filter-chip {
  padding: 7px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--bg-card2);
  color: var(--text-muted);
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex; align-items: center; gap: 6px;
  white-space: nowrap;
}
.filter-chip:active { transform: scale(0.95); }
.filter-chip.active {
  border-color: var(--accent);
  background: rgba(192, 57, 43, 0.1);
  color: var(--accent);
  font-weight: 600;
}

.color-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

.divider-line { height: 1px; background: var(--border); }

.drawer-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
  position: sticky; bottom: 0;
  background: var(--bg-modal);
}

.apply-count {
  background: white; color: var(--accent);
  font-size: 12px; font-weight: 700;
  width: 20px; height: 20px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
}
</style>
