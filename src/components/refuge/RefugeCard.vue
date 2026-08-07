<template>
  <div class="refuge-card">
    <div class="refuge-card__top">
      <span class="refuge-card__icon">{{ typeIcon }}</span>
      <div>
        <h3 class="refuge-card__name">{{ refuge.name }}</h3>
        <p class="refuge-card__type">{{ refuge.type }}</p>
      </div>
    </div>
    <div class="refuge-card__meta">
      <span>📍 {{ refuge.distance }}m away</span>
      <CrowdBadge :level="refuge.crowdLevel || 'low'" />
    </div>
    <p v-if="refuge.address" class="refuge-card__address">{{ refuge.address }}</p>
    <button class="refuge-card__nav-btn" @click="$emit('navigate', refuge)">
      Navigate here
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CrowdBadge from '@/components/common/CrowdBadge.vue'

const props = defineProps({
  refuge: { type: Object, required: true }
})
defineEmits(['navigate'])

const iconMap = {
  park: '🌳', library: '📚', museum: '🏛️', gallery: '🖼️',
  cafe: '☕', place_of_worship: '🕌', default: '📍'
}

const typeIcon = computed(() => {
  const t = props.refuge.type?.toLowerCase() || ''
  return Object.entries(iconMap).find(([k]) => t.includes(k))?.[1] || iconMap.default
})
</script>

<style scoped>
.refuge-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.refuge-card__top { display: flex; align-items: flex-start; gap: 12px; }
.refuge-card__icon { font-size: 2rem; line-height: 1; }
.refuge-card__name { margin: 0; font-size: 1rem; font-weight: 700; color: #111827; }
.refuge-card__type { margin: 0; font-size: 0.8rem; color: #6b7280; text-transform: capitalize; }
.refuge-card__meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #6b7280; }
.refuge-card__address { font-size: 0.8rem; color: #9ca3af; margin: 0; }
.refuge-card__nav-btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #059669;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.refuge-card__nav-btn:hover { background: #047857; }
</style>
