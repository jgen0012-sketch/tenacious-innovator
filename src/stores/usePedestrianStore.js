import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pedestrianApi } from '@/api/pedestrian'
import { USE_MOCK } from '@/api/client'
import { mockSensorLocations, mockLiveCountsPerMinute } from '@/api/mockData'

export const usePedestrianStore = defineStore('pedestrian', () => {
  const sensorLocations = ref([])
  const liveCountsPerMinute = ref([])
  const countsPerHour = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  // 人群密度等级: low / moderate / high
  const getCrowdLevel = computed(() => (count) => {
    if (count < 20) return 'low'
    if (count < 60) return 'moderate'
    return 'high'
  })

  async function fetchSensorLocations() {
    loading.value = true
    error.value = null
    try {
      if (USE_MOCK) throw new Error('mock')
      const data = await pedestrianApi.getSensorLocations()
      sensorLocations.value = data
    } catch {
      sensorLocations.value = mockSensorLocations
    } finally {
      loading.value = false
    }
  }

  async function fetchLiveCounts() {
    loading.value = true
    error.value = null
    try {
      if (USE_MOCK) throw new Error('mock')
      const data = await pedestrianApi.getLiveCountsPerMinute()
      liveCountsPerMinute.value = data
      lastUpdated.value = new Date()
    } catch {
      liveCountsPerMinute.value = mockLiveCountsPerMinute
      lastUpdated.value = new Date()
    } finally {
      loading.value = false
    }
  }

  async function fetchHourlyCounts() {
    loading.value = true
    error.value = null
    try {
      const data = await pedestrianApi.getCountsPerHour()
      countsPerHour.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    sensorLocations,
    liveCountsPerMinute,
    countsPerHour,
    loading,
    error,
    lastUpdated,
    getCrowdLevel,
    fetchSensorLocations,
    fetchLiveCounts,
    fetchHourlyCounts
  }
})
