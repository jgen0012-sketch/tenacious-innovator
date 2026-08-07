<template>
  <span :class="['crowd-badge', `crowd-badge--${level}`]">
    <span class="crowd-badge__dot" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    validator: (v) => ['low', 'moderate', 'high'].includes(v),
    default: 'low'
  }
})

const label = computed(() => {
  const map = { low: 'Quiet', moderate: 'Moderate', high: 'Busy' }
  return map[props.level]
})
</script>

<style scoped>
.crowd-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.crowd-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
/* 🟢 Quiet */
.crowd-badge--low {
  background: #d1fae5;
  color: #065f46;
}
.crowd-badge--low .crowd-badge__dot { background: #10b981; }

/* 🟡 Moderate */
.crowd-badge--moderate {
  background: #fef9c3;
  color: #713f12;
}
.crowd-badge--moderate .crowd-badge__dot { background: #eab308; }

/* 🔴 Busy */
.crowd-badge--high {
  background: #fee2e2;
  color: #7f1d1d;
}
.crowd-badge--high .crowd-badge__dot { background: #ef4444; }
</style>
