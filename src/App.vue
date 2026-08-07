<template>
  <AppNavBar />
  <main class="app-main">
    <RouterView />
  </main>
  <AppFooter v-if="!isMapPage" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavBar from '@/components/common/AppNavBar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()
// 地图类页面不显示 footer，保持全屏
const isMapPage = computed(() => ['Home', 'Map', 'Route'].includes(route.name))
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f9fafb;
  color: #111827;
}

.app-main {
  /* 地图页面本身控制高度，其他页面自然流 */
}
</style>
