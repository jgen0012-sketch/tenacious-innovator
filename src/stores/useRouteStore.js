import { defineStore } from 'pinia'
import { ref } from 'vue'
import { routeApi } from '@/api/routes'
import { USE_MOCK } from '@/api/client'
import { mockRoutes } from '@/api/mockData'

export const useRouteStore = defineStore('route', () => {
  const origin = ref('')
  const destination = ref('')
  const routes = ref([])          // 返回的路线列表（含感官评分）
  const selectedRoute = ref(null) // 用户选中的路线
  const loading = ref(false)
  const error = ref(null)

  async function planRoute(from, to, sensoryPreference = 'low') {
    loading.value = true
    error.value = null
    origin.value = from
    destination.value = to
    try {
      if (USE_MOCK) throw new Error('mock')
      const data = await routeApi.getPedestrianRoutes({ from, to, sensoryPreference })
      routes.value = data
      selectedRoute.value = data[0] || null
    } catch {
      routes.value = mockRoutes
      selectedRoute.value = mockRoutes[0]
    } finally {
      loading.value = false
    }
  }

  function selectRoute(route) {
    selectedRoute.value = route
  }

  function clearRoutes() {
    routes.value = []
    selectedRoute.value = null
    origin.value = ''
    destination.value = ''
  }

  return {
    origin,
    destination,
    routes,
    selectedRoute,
    loading,
    error,
    planRoute,
    selectRoute,
    clearRoutes
  }
})
