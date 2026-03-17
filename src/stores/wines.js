import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { winesApi } from '../api'

const SERVER_FILTERS = ['color_id', 'sugar_id', 'year', 'region_id', 'fortress', 'sort_id', 'class_id', 'winery_id']

export const useWinesStore = defineStore('wines', () => {
  const wines         = ref([])
  const filters       = ref(null)
  const activeFilters = ref({})
  const pagination    = ref(null)
  const loading       = ref(false)
  const page          = ref(1)

  const priceRange    = ref(null)
  const sortBy        = ref(null)
  const searchQuery   = ref('')

  async function loadFilters() {
    if (filters.value) return
    const { data } = await winesApi.getFilters()
    filters.value = data
  }

  async function loadWines(reset = false) {
    if (loading.value) return
    if (reset) { wines.value = []; page.value = 1 }
    loading.value = true
    try {
      const params = { page: page.value }
      SERVER_FILTERS.forEach(k => {
        if (activeFilters.value[k] != null) params[k] = activeFilters.value[k]
      })
      if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

      const { data } = await winesApi.getAll(params)
      wines.value = reset ? data.data : [...wines.value, ...data.data]
      pagination.value = { current: data.current_page, last: data.last_page, total: data.total }
      page.value++
    } finally {
      loading.value = false
    }
  }

  const displayWines = computed(() => {
    let result = wines.value
    if (priceRange.value) {
      result = result.filter(w => w.price >= priceRange.value.min && w.price <= priceRange.value.max)
    }
    if (sortBy.value === 'price_asc')  return [...result].sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price_desc') return [...result].sort((a, b) => b.price - a.price)
    return result
  })

  function setFilter(key, value) {
    if (value === null || value === '') delete activeFilters.value[key]
    else activeFilters.value[key] = value
  }

  function clearFilters() {
    activeFilters.value = {}
    priceRange.value    = null
    sortBy.value        = null
    searchQuery.value   = ''
  }

  const hasMore = computed(() =>
    pagination.value ? pagination.value.current < pagination.value.last : false
  )

  const activeCount = computed(() => {
    let n = Object.keys(activeFilters.value).length
    if (priceRange.value) n++
    if (sortBy.value)     n++
    return n
  })

  return {
    wines, filters, activeFilters, pagination, loading,
    priceRange, sortBy, searchQuery,
    displayWines, activeCount, hasMore,
    loadWines, loadFilters, setFilter, clearFilters,
  }
})
