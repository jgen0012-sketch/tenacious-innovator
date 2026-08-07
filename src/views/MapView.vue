<template>
  <div class="map-view">
    <!-- 全屏地图 -->
    <LeafletMap
      ref="leafletRef"
      :sensors="enrichedSensors"
      class="map-view__map"
      @sensor-click="onSensorClick"
    />

    <!-- 左侧信息面板 -->
    <div class="map-view__panel">
      <h2 class="map-view__title">Live Crowd Map</h2>
      <p class="map-view__updated" v-if="pedestrianStore.lastUpdated">
        Updated: {{ formattedTime }}
      </p>

      <div class="map-view__legend">
        <CrowdBadge level="low"      />
        <CrowdBadge level="moderate" />
        <CrowdBadge level="high"     />
      </div>

      <div class="map-view__sensor-list">
        <div
          v-for="sensor in enrichedSensors"
          :key="sensor.sensorId"
          class="map-view__sensor-item"
          @click="flyTo(sensor)"
        >
          <span :class="['map-view__dot', `map-view__dot--${sensor.crowdLevel}`]" />
          <span class="map-view__sensor-name">{{ sensor.name }}</span>
          <CrowdBadge :level="sensor.crowdLevel" />
        </div>
      </div>
    </div>

    <!-- 传感器底部弹出卡片 -->
    <transition name="slide-up">
      <div v-if="selectedSensor" class="map-view__card">
        <div class="map-view__card-header">
          <strong>{{ selectedSensor.name }}</strong>
          <button @click="selectedSensor = null">✕</button>
        </div>
        <div class="map-view__card-body">
          <CrowdBadge :level="selectedSensor.crowdLevel" />
          <span>{{ selectedSensor.count }} pedestrians/min</span>
        </div>
        <button class="map-view__card-btn" @click="navigateToSensor">🧭 Navigate here</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePedestrianStore } from '@/stores/usePedestrianStore'
import { useRouteStore } from '@/stores/useRouteStore'
import LeafletMap from '@/components/map/LeafletMap.vue'
import CrowdBadge from '@/components/common/CrowdBadge.vue'

const pedestrianStore = usePedestrianStore()
const routeStore = useRouteStore()
const router = useRouter()
const leafletRef = ref(null)
const selectedSensor = ref(null)

const enrichedSensors = computed(() =>
  pedestrianStore.sensorLocations.map((s) => {
    const live = pedestrianStore.liveCountsPerMinute.find(c => c.sensorId === s.sensorId)
    const count = live?.count || 0
    return { ...s, count, crowdLevel: pedestrianStore.getCrowdLevel(count) }
  })
)

const formattedTime = computed(() =>
  pedestrianStore.lastUpdated?.toLocaleTimeString('en-AU', { timeStyle: 'short' }) || ''
)

function flyTo(sensor) {
  leafletRef.value?.flyTo(sensor.lat, sensor.lng, 16)
  selectedSensor.value = sensor
}

function onSensorClick(sensor) {
  selectedSensor.value = sensor
}

function navigateToSensor() {
  routeStore.destination = selectedSensor.value.name
  router.push('/route')
}

onMounted(async () => {
  await Promise.all([
    pedestrianStore.fetchSensorLocations(),
    pedestrianStore.fetchLiveCounts()
  ])
})
</script>

<style scoped>
.map-view {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
}
.map-view__map { position: absolute; inset: 0; z-index: 0; }

.map-view__panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  width: 300px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 16px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.map-view__title { margin: 0; font-size: 1rem; font-weight: 700; color: #111827; }
.map-view__updated { margin: 0; font-size: 0.75rem; color: #9ca3af; }
.map-view__legend { display: flex; gap: 6px; flex-wrap: wrap; }

.map-view__sensor-list { display: flex; flex-direction: column; gap: 6px; }
.map-view__sensor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.map-view__sensor-item:hover { background: #f3f4f6; }
.map-view__dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.map-view__dot--low      { background: #10b981; }
.map-view__dot--moderate { background: #eab308; }
.map-view__dot--high     { background: #ef4444; }
.map-view__sensor-name { flex: 1; font-size: 0.82rem; color: #374151; }

.map-view__card {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  padding: 16px 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.map-view__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #111827;
}
.map-view__card-header button {
  background: none; border: none; cursor: pointer; color: #9ca3af;
}
.map-view__card-body {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #6b7280;
}
.map-view__card-btn {
  padding: 8px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
.map-view__card-btn:hover { background: #1e40af; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
