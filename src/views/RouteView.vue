<template>
  <div class="route-view">
    <!-- Search panel -->
    <div class="route-view__panel">
      <h2 class="route-view__title">Plan Your Route</h2>

      <div class="route-view__form">
        <label class="route-view__label">From</label>
        <input
          v-model="origin"
          type="text"
          placeholder="Your current location or address"
          class="route-view__input"
        />

        <label class="route-view__label">To</label>
        <input
          v-model="destination"
          type="text"
          placeholder="Destination in Melbourne CBD"
          class="route-view__input"
        />

        <label class="route-view__label">Sensory preference</label>
        <div class="route-view__preference">
          <button
            v-for="opt in preferenceOptions"
            :key="opt.value"
            :class="['pref-btn', { 'pref-btn--active': preference === opt.value }]"
            @click="preference = opt.value"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>

        <button
          class="route-view__search-btn"
          :disabled="routeStore.loading"
          @click="handlePlanRoute"
        >
          {{ routeStore.loading ? 'Finding routes…' : '🔍 Find Sensory-Friendly Routes' }}
        </button>
      </div>

      <!-- Error -->
      <p v-if="routeStore.error" class="route-view__error">{{ routeStore.error }}</p>

      <!-- Route results -->
      <div v-if="routeStore.routes.length" class="route-view__results">
        <h3 class="route-view__results-title">
          {{ routeStore.routes.length }} route(s) found
        </h3>
        <RouteCard
          v-for="(route, i) in routeStore.routes"
          :key="route.routeId"
          :route="route"
          :index="i"
          :selected="routeStore.selectedRoute?.routeId === route.routeId"
          @select="routeStore.selectRoute"
        />
      </div>
    </div>

    <!-- Map area -->
    <div class="route-view__map">
      <LeafletMap
        :sensors="enrichedSensors"
        :zoom="14"
        class="route-view__leaflet"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouteStore } from '@/stores/useRouteStore'
import { usePedestrianStore } from '@/stores/usePedestrianStore'
import RouteCard from '@/components/route/RouteCard.vue'
import LeafletMap from '@/components/map/LeafletMap.vue'

const routeStore = useRouteStore()
const pedestrianStore = usePedestrianStore()

const enrichedSensors = computed(() =>
  pedestrianStore.sensorLocations.map((s) => {
    const live = pedestrianStore.liveCountsPerMinute.find(c => c.sensorId === s.sensorId)
    const count = live?.count || 0
    return { ...s, count, crowdLevel: pedestrianStore.getCrowdLevel(count) }
  })
)

const origin = ref('')
const destination = ref(routeStore.destination || '')
const preference = ref('low')

const preferenceOptions = [
  { value: 'low',      icon: '🟢', label: 'Quietest'  },
  { value: 'moderate', icon: '🟡', label: 'Balanced'  },
  { value: 'any',      icon: '⚡', label: 'Fastest'   }
]

async function handlePlanRoute() {
  if (!origin.value.trim() || !destination.value.trim()) return
  await routeStore.planRoute(origin.value, destination.value, preference.value)
}

onMounted(async () => {
  if (routeStore.destination) destination.value = routeStore.destination
  await Promise.all([
    pedestrianStore.fetchSensorLocations(),
    pedestrianStore.fetchLiveCounts()
  ])
})
</script>

<style scoped>
.route-view { display: flex; height: calc(100vh - 60px); overflow: hidden; }
.route-view__panel {
  width: 360px;
  min-width: 320px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.route-view__title { margin: 0; font-size: 1.15rem; font-weight: 700; color: #111827; }
.route-view__form { display: flex; flex-direction: column; gap: 10px; }
.route-view__label { font-size: 0.82rem; font-weight: 600; color: #374151; }
.route-view__input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}
.route-view__input:focus { border-color: #3b82f6; }
.route-view__preference { display: flex; gap: 6px; flex-wrap: wrap; }
.pref-btn {
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.15s;
}
.pref-btn--active {
  border-color: #1d4ed8;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
}
.route-view__search-btn {
  padding: 12px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.route-view__search-btn:hover:not(:disabled) { background: #1e40af; }
.route-view__search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.route-view__error { color: #ef4444; font-size: 0.85rem; margin: 0; }
.route-view__results { display: flex; flex-direction: column; gap: 12px; }
.route-view__results-title { margin: 0; font-size: 0.9rem; color: #6b7280; }
.route-view__map { flex: 1; position: relative; }
.route-view__leaflet { position: absolute; inset: 0; }
</style>
