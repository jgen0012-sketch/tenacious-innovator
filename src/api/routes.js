/**
 * 路线规划 API
 * 核心功能: 基于行人密度数据生成感官友好路线
 */
import client from './client'

export const routeApi = {
  /**
   * 获取感官友好步行路线列表
   * POST /routes/pedestrian
   * @param {Object} body
   *   - from: string (起点地址或坐标 "lat,lng")
   *   - to: string (终点地址或坐标 "lat,lng")
   *   - sensoryPreference: 'low' | 'moderate' | 'any'
   *   - maxCrowdThreshold: number (每分钟最大人流量)
   * @returns {Promise<Array<{
   *   routeId, distance, duration,
   *   sensoryScore: 'low'|'moderate'|'high',
   *   geometry: GeoJSON.LineString,
   *   waypoints: Array<{ lat, lng, crowdLevel }>
   * }>>}
   */
  getPedestrianRoutes(body) {
    return client.post('/routes/pedestrian', body)
  },

  /**
   * 获取路线沿途实时人群数据
   * GET /routes/:routeId/crowd
   * @param {string} routeId
   * @returns {Promise<Array<{ lat, lng, count, level }>>}
   */
  getRouteCrowdData(routeId) {
    return client.get(`/routes/${routeId}/crowd`)
  },

  /**
   * 当人流超出阈值时请求替代路线
   * POST /routes/alternative
   * @param {Object} body - { currentRouteId, currentLat, currentLng, destination }
   * @returns {Promise<{ routeId, geometry, sensoryScore }>}
   */
  getAlternativeRoute(body) {
    return client.post('/routes/alternative', body)
  },

  /**
   * 地理编码（地址 → 坐标）
   * GET /routes/geocode
   * @param {string} address
   * @returns {Promise<{ lat, lng, formattedAddress }>}
   */
  geocode(address) {
    return client.get('/routes/geocode', { params: { address } })
  }
}
