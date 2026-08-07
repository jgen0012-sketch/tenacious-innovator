<template>
  <div class="sensory-indicator">
    <div
      v-for="step in steps"
      :key="step.level"
      :class="['si__step', `si__step--${step.level}`, { 'si__step--active': step.level === activeLevel }]"
    >
      <span class="si__icon">{{ step.icon }}</span>
      <span class="si__label">{{ step.label }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  level: {
    type: String,
    validator: (v) => ['low', 'moderate', 'high'].includes(v),
    default: 'low'
  }
})

const activeLevel = props.level

const steps = [
  { level: 'low',      icon: '🟢', label: 'Quiet'    },
  { level: 'moderate', icon: '🟡', label: 'Moderate' },
  { level: 'high',     icon: '🔴', label: 'Busy'     }
]
</script>

<style scoped>
.sensory-indicator {
  display: flex;
  gap: 8px;
}
.si__step {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #9ca3af;
  background: #f3f4f6;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.si__step--active { opacity: 1; font-weight: 700; }
.si__step--active.si__step--low      { background: #d1fae5; color: #065f46; }
.si__step--active.si__step--moderate { background: #fef9c3; color: #713f12; }
.si__step--active.si__step--high     { background: #fee2e2; color: #7f1d1d; }
</style>
