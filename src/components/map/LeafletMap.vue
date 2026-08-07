<template>
  <div ref="mapEl" class="leaflet-map" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'

// 修复 Leaflet 默认图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const props = defineProps({
  center: { type: Array, default: () => [-37.8136, 144.9631] }, // 墨尔本市中心
  zoom: { type: Number, default: 14 },
  sensors: { type: Array, default: () => [] }   // [{ sensorId, name, lat, lng, crowdLevel }]
})

const emit = defineEmits(['map-ready', 'sensor-click'])

const mapEl = ref(null)
let map = null
const markerLayer = L.layerGroup()

const CROWD_COLORS = {
  low:      { color: '#10b981', fill: '#d1fae5', label: 'Quiet'    },
  moderate: { color: '#eab308', fill: '#fef9c3', label: 'Moderate' },
  high:     { color: '#ef4444', fill: '#fee2e2', label: 'Busy'     }
}

function makeCircleMarker(sensor) {
  const c = CROWD_COLORS[sensor.crowdLevel] || CROWD_COLORS.low
  const marker = L.circleMarker([sensor.lat, sensor.lng], {
    radius: 10,
    color: c.color,
    fillColor: c.color,
    fillOpacity: 0.85,
    weight: 2
  })
  marker.bindPopup(`
    <div style="min-width:160px">
      <strong style="font-size:0.95rem">${sensor.name}</strong><br/>
      <span style="
        display:inline-block;margin-top:6px;
        padding:2px 10px;border-radius:999px;font-size:0.78rem;font-weight:700;
        background:${c.fill};color:${c.color}
      ">● ${c.label}</span>
    </div>
  `)
  marker.on('click', () => emit('sensor-click', sensor))
  return marker
}

function refreshMarkers() {
  markerLayer.clearLayers()
  props.sensors.forEach(s => markerLayer.addLayer(makeCircleMarker(s)))
}

onMounted(() => {
  map = L.map(mapEl.value, {
    center: props.center,
    zoom: props.zoom,
    zoomControl: false
  })

  // Google Maps 风格底图
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  // 缩放控件放右下角（像 Google Maps）
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  markerLayer.addTo(map)
  refreshMarkers()

  emit('map-ready', map)
})

onBeforeUnmount(() => {
  if (map) { map.remove(); map = null }
})

watch(() => props.sensors, refreshMarkers, { deep: true })

defineExpose({
  flyTo: (lat, lng, zoom = 16) => map?.flyTo([lat, lng], zoom, { duration: 1 }),
  getMap: () => map
})
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100%;
}
</style>
