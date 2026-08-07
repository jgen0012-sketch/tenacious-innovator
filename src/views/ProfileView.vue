<template>
  <div class="profile-view">
    <div class="profile-view__card">
      <h1 class="profile-view__title">My Sensory Profile</h1>
      <p class="profile-view__sub">Personalise your experience to match your sensory preferences.</p>

      <div class="profile-view__section">
        <h2>Crowd Threshold</h2>
        <p>What is the maximum crowd level you're comfortable with?</p>
        <div class="profile-view__options">
          <button
            v-for="opt in crowdOptions"
            :key="opt.value"
            :class="['pref-btn', { 'pref-btn--active': prefs.crowdThreshold === opt.value }]"
            @click="prefs.crowdThreshold = opt.value"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="profile-view__section">
        <h2>Max Walking Distance</h2>
        <p>How far are you willing to walk to avoid a crowded area?</p>
        <div class="profile-view__options">
          <button
            v-for="d in distanceOptions"
            :key="d.value"
            :class="['pref-btn', { 'pref-btn--active': prefs.maxWalkingDistance === d.value }]"
            @click="prefs.maxWalkingDistance = d.value"
          >
            {{ d.label }}
          </button>
        </div>
      </div>

      <div class="profile-view__section">
        <h2>Alerts</h2>
        <label class="profile-view__toggle">
          <input type="checkbox" v-model="prefs.alertsEnabled" />
          <span>Receive predictive crowd alerts</span>
        </label>
        <label class="profile-view__toggle">
          <input type="checkbox" v-model="prefs.preferIndoor" />
          <span>Prefer indoor quiet spaces</span>
        </label>
      </div>

      <button class="profile-view__save-btn" @click="savePreferences">
        ✓ Save Preferences
      </button>
      <p v-if="saved" class="profile-view__saved-msg">Preferences saved!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
const saved = ref(false)

const prefs = reactive({ ...userStore.sensoryPreferences })

const crowdOptions = [
  { value: 'low',      icon: '🟢', label: 'Quiet only'    },
  { value: 'moderate', icon: '🟡', label: 'Moderate okay' },
  { value: 'high',     icon: '🔴', label: 'Any level'     }
]

const distanceOptions = [
  { value: 300,  label: '300m'  },
  { value: 500,  label: '500m'  },
  { value: 1000, label: '1 km'  },
  { value: 2000, label: '2 km'  }
]

function savePreferences() {
  userStore.updateSensoryPreferences(prefs)
  saved.value = true
  setTimeout(() => { saved.value = false }, 2500)
}
</script>

<style scoped>
.profile-view {
  display: flex;
  justify-content: center;
  padding: 40px 24px;
}
.profile-view__card {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.profile-view__title { margin: 0; font-size: 1.6rem; font-weight: 800; color: #111827; }
.profile-view__sub { margin: 0; color: #6b7280; }
.profile-view__section { display: flex; flex-direction: column; gap: 8px; }
.profile-view__section h2 { margin: 0; font-size: 1rem; font-weight: 700; color: #111827; }
.profile-view__section p { margin: 0; font-size: 0.85rem; color: #6b7280; }
.profile-view__options { display: flex; gap: 8px; flex-wrap: wrap; }
.pref-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}
.pref-btn--active {
  border-color: #1d4ed8;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
}
.profile-view__toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
}
.profile-view__save-btn {
  padding: 12px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.profile-view__save-btn:hover { background: #1e40af; }
.profile-view__saved-msg { color: #059669; font-weight: 600; margin: 0; }
</style>
