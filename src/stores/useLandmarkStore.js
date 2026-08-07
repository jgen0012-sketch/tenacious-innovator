import { defineStore } from 'pinia'
import { ref } from 'vue'
import { landmarksApi } from '@/api/landmarks'
import { USE_MOCK } from '@/api/client'
import { mockRefuges } from '@/api/mockData'

export const useLandmarkStore = defineStore('landmark', () => {
  const landmarks = ref([])
  const refuges = ref([])         // 过滤后的安静空间（公园、图书馆等）
  const loading = ref(false)
  const error = ref(null)

  const REFUGE_TYPES = ['park', 'library', 'museum', 'gallery', 'cafe', 'place_of_worship']

  async function fetchLandmarks(bbox = null) {
    loading.value = true
    error.value = null
    try {
      if (USE_MOCK) throw new Error('mock')
      const data = await landmarksApi.getLandmarks(bbox)
      landmarks.value = data
      refuges.value = data.filter(l =>
        REFUGE_TYPES.some(t => l.type?.toLowerCase().includes(t))
      )
    } catch {
      landmarks.value = mockRefuges
      refuges.value = mockRefuges
    } finally {
      loading.value = false
    }
  }

  async function fetchNearbyRefuges(lat, lng, radiusMeters = 500) {
    loading.value = true
    error.value = null
    try {
      if (USE_MOCK) throw new Error('mock')
      const data = await landmarksApi.getNearbyRefuges(lat, lng, radiusMeters)
      refuges.value = data
    } catch {
      refuges.value = mockRefuges
    } finally {
      loading.value = false
    }
  }

  return {
    landmarks,
    refuges,
    loading,
    error,
    fetchLandmarks,
    fetchNearbyRefuges
  }
})
