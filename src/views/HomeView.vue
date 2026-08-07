<template>
  <div class="home">
    <!-- ── 全屏地图 ── -->
    <LeafletMap
      ref="leafletRef"
      :sensors="enrichedSensors"
      class="home__map"
      @sensor-click="onSensorClick"
    />

    <!-- ── 左侧浮层面板（Google Maps 风格）── -->
    <div class="home__panel" :class="{ 'home__panel--expanded': panelExpanded }">
      <!-- 搜索框 -->
      <div class="home__search-box">
        <span class="home__search-icon">🔍</span>
        <input
          v-model="destination"
          type="text"
          placeholder="Search in Melbourne CBD…"
          class="home__search-input"
          @keyup.enter="handleSearch"
          @focus="panelExpanded = true"
        />
        <button v-if="destination" class="home__search-clear" @click="destination = ''">✕</button>
      </div>

      <!-- 感官偏好快捷切换 -->
      <div class="home__pref-row">
        <button
          v-for="opt in prefOptions"
          :key="opt.value"
          :class="['home__pref-btn', { 'home__pref-btn--active': preference === opt.value }]"
          @click="preference = opt.value"
        >
          {{ opt.icon }} {{ opt.label }}
        </button>
      </div>

      <!-- 搜索按钮 -->
      <button class="home__go-btn" @click="handleSearch">
        Get sensory-friendly directions
      </button>

      <!-- 人群密度图例 -->
      <div class="home__legend">
        <span class="home__legend-title">Live crowd density</span>
        <div class="home__legend-items">
          <span class="home__legend-dot home__legend-dot--low" />Quiet
          <span class="home__legend-dot home__legend-dot--moderate" />Moderate
          <span class="home__legend-dot home__legend-dot--high" />Busy
        </div>
        <p v-if="pedestrianStore.lastUpdated" class="home__legend-time">
          Updated {{ formattedTime }}
        </p>
      </div>

      <!-- 传感器列表（可收起） -->
      <div class="home__sensor-list" v-show="panelExpanded">
        <p class="home__sensor-list-title">
          {{ enrichedSensors.length }} sensors active
        </p>
        <div
          v-for="s in enrichedSensors"
          :key="s.sensorId"
          class="home__sensor-item"
          @click="flyToSensor(s)"
        >
          <span
            :class="['home__sensor-dot', `home__sensor-dot--${s.crowdLevel}`]"
          />
          <span class="home__sensor-name">{{ s.name }}</span>
          <span class="home__sensor-count">{{ s.count }}/min</span>
        </div>
      </div>

      <!-- 展开 / 收起 -->
      <button class="home__toggle" @click="panelExpanded = !panelExpanded">
        {{ panelExpanded ? '▲ Show less' : '▼ Show sensors' }}
      </button>
    </div>

    <!-- ── 传感器点击弹出的浮层 ── -->
    <transition name="slide-up">
      <div v-if="selectedSensor" class="home__sensor-card">
        <div class="home__sensor-card-header">
          <strong>{{ selectedSensor.name }}</strong>
          <button class="home__sensor-card-close" @click="selectedSensor = null">✕</button>
        </div>
        <div class="home__sensor-card-body">
          <CrowdBadge :level="selectedSensor.crowdLevel" />
          <span class="home__sensor-card-count">{{ selectedSensor.count }} pedestrians/min</span>
        </div>
        <button class="home__sensor-card-route" @click="routeToSensor">
          🧭 Navigate here
        </button>
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

const router = useRouter()
const pedestrianStore = usePedestrianStore()
const routeStore = useRouteStore()

const destination = ref('')
const preference = ref('low')
const panelExpanded = ref(false)
const selectedSensor = ref(null)
const leafletRef = ref(null)

const prefOptions = [
  { value: 'low',      icon: '🟢', label: 'Quietest' },
  { value: 'moderate', icon: '🟡', label: 'Balanced'  },
  { value: 'any',      icon: '⚡', label: 'Fastest'   }
]

const enrichedSensors = computed(() =>
  pedestrianStore.sensorLocations.map((s) => {
    const live = pedestrianStore.liveCountsPerMinute.find(c => c.sensorId === s.sensorId)
    const count = live?.count || 0
    return { ...s, count, crowdLevel: pedestrianStore.getCrowdLevel(count) }
  })
)

const formattedTime = computed(() => {
  if (!pedestrianStore.lastUpdated) return ''
  return pedestrianStore.lastUpdated.toLocaleTimeString('en-AU', { timeStyle: 'short' })
})

function handleSearch() {
  if (!destination.value.trim()) return
  routeStore.destination = destination.value
  router.push('/route')
}

function flyToSensor(sensor) {
  leafletRef.value?.flyTo(sensor.lat, sensor.lng, 16)
  selectedSensor.value = sensor
}

function onSensorClick(sensor) {
  selectedSensor.value = sensor
}

function routeToSensor() {
  if (!selectedSensor.value) return
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
.home {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* ── 地图占满整个区域 ── */
.home__map {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* ── 左侧浮层面板 ── */
.home__panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  width: 340px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  transition: max-height 0.3s ease;
}

/* 搜索框 */
.home__search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 10px 12px;
}
.home__search-icon { font-size: 1rem; flex-shrink: 0; }
.home__search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #111827;
}
.home__search-input::placeholder { color: #9ca3af; }
.home__search-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.85rem;
  padding: 0;
}

/* 偏好快捷按钮 */
.home__pref-row { display: flex; gap: 6px; }
.home__pref-btn {
  flex: 1;
  padding: 6px 4px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 0.78rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}
.home__pref-btn--active {
  border-color: #1d4ed8;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
}

/* 导航按钮 */
.home__go-btn {
  width: 100%;
  padding: 10px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.home__go-btn:hover { background: #1e40af; }

/* 图例 */
.home__legend {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.home__legend-title { font-size: 0.78rem; font-weight: 700; color: #374151; }
.home__legend-items {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  color: #6b7280;
}
.home__legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.home__legend-dot--low      { background: #10b981; }
.home__legend-dot--moderate { background: #eab308; }
.home__legend-dot--high     { background: #ef4444; }
.home__legend-time { margin: 0; font-size: 0.72rem; color: #9ca3af; }

/* 传感器列表 */
.home__sensor-list { display: flex; flex-direction: column; gap: 4px; }
.home__sensor-list-title { margin: 0 0 4px; font-size: 0.78rem; color: #9ca3af; font-weight: 600; }
.home__sensor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.home__sensor-item:hover { background: #f3f4f6; }
.home__sensor-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.home__sensor-dot--low      { background: #10b981; }
.home__sensor-dot--moderate { background: #eab308; }
.home__sensor-dot--high     { background: #ef4444; }
.home__sensor-name { flex: 1; font-size: 0.82rem; color: #374151; }
.home__sensor-count { font-size: 0.75rem; color: #9ca3af; }

/* 展开按钮 */
.home__toggle {
  border: none;
  background: none;
  font-size: 0.78rem;
  color: #6b7280;
  cursor: pointer;
  padding: 2px 0;
  text-align: center;
}
.home__toggle:hover { color: #1d4ed8; }

/* ── 传感器点击底部卡片 ── */
.home__sensor-card {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  padding: 16px 20px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.home__sensor-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #111827;
}
.home__sensor-card-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.9rem;
}
.home__sensor-card-body {
  display: flex;
  align-items: center;
  gap: 12px;
}
.home__sensor-card-count { font-size: 0.85rem; color: #6b7280; }
.home__sensor-card-route {
  padding: 9px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}
.home__sensor-card-route:hover { background: #1e40af; }

/* 动画 */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
