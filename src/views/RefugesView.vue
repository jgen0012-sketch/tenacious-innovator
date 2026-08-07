<template>
  <div class="refuges-view">
    <div class="refuges-view__header">
      <h1 class="refuges-view__title">Nearby Quiet Spaces</h1>
      <p class="refuges-view__sub">Find calm, low-sensory refuges within walking distance.</p>

      <div class="refuges-view__controls">
        <select v-model="selectedType" class="refuges-view__select">
          <option value="">All types</option>
          <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="radius" class="refuges-view__select">
          <option value="300">300m</option>
          <option value="500">500m</option>
          <option value="1000">1km</option>
        </select>
        <button class="refuges-view__refresh-btn" @click="fetchNearby">
          📍 Use my location
        </button>
      </div>
    </div>

    <p v-if="landmarkStore.loading" class="refuges-view__loading">Loading quiet spaces…</p>
    <p v-else-if="landmarkStore.error" class="refuges-view__error">{{ landmarkStore.error }}</p>

    <div v-else class="refuges-view__grid">
      <RefugeCard
        v-for="refuge in filteredRefuges"
        :key="refuge.id"
        :refuge="refuge"
        @navigate="handleNavigate"
      />
      <p v-if="!filteredRefuges.length" class="refuges-view__empty">
        No quiet spaces found nearby. Try increasing the radius.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLandmarkStore } from '@/stores/useLandmarkStore'
import { useRouteStore } from '@/stores/useRouteStore'
import RefugeCard from '@/components/refuge/RefugeCard.vue'

const landmarkStore = useLandmarkStore()
const routeStore = useRouteStore()
const router = useRouter()

const selectedType = ref('')
const radius = ref('500')

const typeOptions = ['park', 'library', 'museum', 'gallery', 'cafe', 'place of worship']

const filteredRefuges = computed(() => {
  if (!selectedType.value) return landmarkStore.refuges
  return landmarkStore.refuges.filter(r =>
    r.type?.toLowerCase().includes(selectedType.value)
  )
})

async function fetchNearby() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      await landmarkStore.fetchNearbyRefuges(coords.latitude, coords.longitude, Number(radius.value))
    },
    () => landmarkStore.fetchLandmarks()
  )
}

function handleNavigate(refuge) {
  routeStore.destination = refuge.name
  router.push('/route')
}

onMounted(() => {
  landmarkStore.fetchLandmarks()
})
</script>

<style scoped>
.refuges-view { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.refuges-view__header { display: flex; flex-direction: column; gap: 10px; }
.refuges-view__title { margin: 0; font-size: 1.6rem; font-weight: 800; color: #111827; }
.refuges-view__sub { margin: 0; color: #6b7280; }
.refuges-view__controls { display: flex; gap: 10px; flex-wrap: wrap; }
.refuges-view__select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.88rem;
  background: #fff;
  outline: none;
}
.refuges-view__refresh-btn {
  padding: 8px 16px;
  background: #059669;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}
.refuges-view__refresh-btn:hover { background: #047857; }
.refuges-view__loading, .refuges-view__error, .refuges-view__empty {
  color: #6b7280;
  font-size: 0.9rem;
}
.refuges-view__error { color: #ef4444; }
.refuges-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
</style>
