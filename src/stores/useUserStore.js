import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)
  const isLoggedIn = computed(() => !!profile.value)

  // 感官偏好配置（本地存储持久化）
  const sensoryPreferences = ref(
    JSON.parse(localStorage.getItem('sensoryPreferences') || 'null') || {
      crowdThreshold: 'low',       // low | moderate | high
      noiseThreshold: 'low',
      preferIndoor: false,
      maxWalkingDistance: 1000,    // 单位：米
      alertsEnabled: true
    }
  )

  async function login(credentials) {
    const data = await userApi.login(credentials)
    profile.value = data
    return data
  }

  async function logout() {
    await userApi.logout()
    profile.value = null
  }

  async function fetchProfile() {
    const data = await userApi.getProfile()
    profile.value = data
    return data
  }

  function updateSensoryPreferences(prefs) {
    sensoryPreferences.value = { ...sensoryPreferences.value, ...prefs }
    localStorage.setItem('sensoryPreferences', JSON.stringify(sensoryPreferences.value))
  }

  return {
    profile,
    isLoggedIn,
    sensoryPreferences,
    login,
    logout,
    fetchProfile,
    updateSensoryPreferences
  }
})
