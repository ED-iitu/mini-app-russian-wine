import axios from 'axios'

const api = axios.create({
  baseURL: 'https://russianvine.ru/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export const winesApi = {
  getAll(params = {}) {
    return api.get('/wines', { params })
  },
  getOne(id) {
    return api.get(`/wines/${id}`)
  },
  getFilters() {
    return api.get('/wines/filters')
  }
}

export const orderApi = {
  create(data) {
    return api.post('/order', data)
  }
}

export function getImageUrl(image) {
  if (!image) return null
  if (image.startsWith('http')) return image
  return `https://russianvine.ru/storage/${image}`
}
