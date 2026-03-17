import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

  function save() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(wine) {
    const existing = items.value.find(i => i.id === wine.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: wine.id,
        title: wine.title,
        model: wine.model,
        price: wine.price,
        image: wine.image,
        quantity: 1
      })
    }
    save()
  }

  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function updateQty(id, qty) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      if (qty <= 0) removeItem(id)
      else item.quantity = qty
      save()
    }
  }

  function clear() {
    items.value = []
    save()
  }

  const totalCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

  return { items, addItem, removeItem, updateQty, clear, totalCount, totalPrice }
})
