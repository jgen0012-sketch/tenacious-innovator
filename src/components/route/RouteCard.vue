<template>
  <div
    :class="['route-card', { 'route-card--selected': selected }]"
    @click="$emit('select', route)"
  >
    <div class="route-card__header">
      <span class="route-card__title">Route {{ index + 1 }}</span>
      <SensoryIndicator :level="route.sensoryScore" />
    </div>
    <div class="route-card__meta">
      <span>🚶 {{ route.distance }}m</span>
      <span>⏱ {{ route.duration }} min</span>
    </div>
    <p v-if="route.note" class="route-card__note">{{ route.note }}</p>
    <button v-if="!selected" class="route-card__btn">Choose this route</button>
    <span v-else class="route-card__selected-tag">✓ Selected</span>
  </div>
</template>

<script setup>
import SensoryIndicator from './SensoryIndicator.vue'
defineProps({
  route: { type: Object, required: true },
  index: { type: Number, default: 0 },
  selected: { type: Boolean, default: false }
})
defineEmits(['select'])
</script>

<style scoped>
.route-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.route-card:hover { border-color: #93c5fd; box-shadow: 0 2px 8px rgba(59,130,246,0.1); }
.route-card--selected { border-color: #1d4ed8; background: #eff6ff; }
.route-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.route-card__title { font-weight: 700; font-size: 0.95rem; color: #111827; }
.route-card__meta { display: flex; gap: 16px; font-size: 0.85rem; color: #6b7280; margin-bottom: 8px; }
.route-card__note { font-size: 0.82rem; color: #6b7280; margin: 0 0 10px; }
.route-card__btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}
.route-card__btn:hover { background: #1e40af; }
.route-card__selected-tag { font-size: 0.85rem; color: #1d4ed8; font-weight: 700; }
</style>
