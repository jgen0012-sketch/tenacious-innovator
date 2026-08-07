<template>
  <nav class="navbar">
    <div class="navbar__brand">
      <router-link to="/" class="navbar__logo">
        <img src="@/assets/logo.svg" alt="SensoryPath" class="navbar__logo-img" />
        <span>SensoryPath</span>
      </router-link>
    </div>

    <ul class="navbar__links">
      <li v-for="link in navLinks" :key="link.to">
        <router-link :to="link.to" class="navbar__link" active-class="navbar__link--active">
          <span class="navbar__link-icon">{{ link.icon }}</span>
          <span class="navbar__link-text">{{ link.label }}</span>
        </router-link>
      </li>
    </ul>

    <div class="navbar__actions">
      <CrowdBadge v-if="currentCrowdLevel" :level="currentCrowdLevel" />
      <router-link to="/profile" class="navbar__avatar">
        <span>{{ userInitial }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { usePedestrianStore } from '@/stores/usePedestrianStore'
import CrowdBadge from './CrowdBadge.vue'

const userStore = useUserStore()
const pedestrianStore = usePedestrianStore()

const navLinks = [
  { to: '/',        icon: '🏠', label: 'Home'        },
  { to: '/map',     icon: '🗺️',  label: 'Live Map'    },
  { to: '/route',   icon: '🧭', label: 'Plan Route'  },
  { to: '/refuges', icon: '🌿', label: 'Quiet Spaces' }
]

const userInitial = computed(() => {
  const name = userStore.profile?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const currentCrowdLevel = computed(() => {
  const counts = pedestrianStore.liveCountsPerMinute
  if (!counts.length) return null
  const avg = counts.reduce((s, c) => s + (c.count || 0), 0) / counts.length
  return pedestrianStore.getCrowdLevel(avg)
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  color: #1d4ed8;
  text-decoration: none;
}
.navbar__logo-img { width: 28px; height: 28px; }
.navbar__links {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar__link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.2s;
}
.navbar__link:hover { background: #f3f4f6; }
.navbar__link--active { background: #eff6ff; color: #1d4ed8; font-weight: 600; }
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.navbar__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
}
</style>
