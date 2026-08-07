/**
 * 行人计数系统 API
 * 数据来源: City of Melbourne Open Data Portal
 *   - Pedestrian Counting System – Sensor Locations
 *   - Pedestrian Counting System – Past Hour (counts per minute, refreshed every 15 min)
 *   - Pedestrian Counting System – Past Hour (counts per hour, refreshed every 1 hr)
 */
import client from './client'

export const pedestrianApi = {
  /**
   * 获取所有传感器位置列表
   * GET /pedestrian/sensors
   * @returns {Promise<Array<{ sensorId, name, lat, lng, status }>>}
   */
  getSensorLocations() {
    return client.get('/pedestrian/sensors')
  },

  /**
   * 获取过去一小时内每分钟行人计数（每15分钟刷新）
   * GET /pedestrian/counts/minute
   * @param {Object} params - { sensorId?, limit? }
   * @returns {Promise<Array<{ sensorId, timestamp, count }>>}
   */
  getLiveCountsPerMinute(params = {}) {
    return client.get('/pedestrian/counts/minute', { params })
  },

  /**
   * 获取过去一小时内每小时行人计数（每小时刷新）
   * GET /pedestrian/counts/hour
   * @param {Object} params - { sensorId?, date?, limit? }
   * @returns {Promise<Array<{ sensorId, hour, count }>>}
   */
  getCountsPerHour(params = {}) {
    return client.get('/pedestrian/counts/hour', { params })
  },

  /**
   * 获取特定传感器的历史数据（用于 Hindsight 洞察）
   * GET /pedestrian/sensors/:sensorId/history
   * @param {string|number} sensorId
   * @param {Object} params - { startDate, endDate }
   * @returns {Promise<Array<{ timestamp, count }>>}
   */
  getSensorHistory(sensorId, params = {}) {
    return client.get(`/pedestrian/sensors/${sensorId}/history`, { params })
  },

  /**
   * 获取区域实时拥挤度评分（聚合多传感器数据）
   * GET /pedestrian/crowd-level
   * @param {Object} params - { lat, lng, radius }
   * @returns {Promise<{ level: 'low'|'moderate'|'high', score: number }>}
   */
  getCrowdLevel(params) {
    return client.get('/pedestrian/crowd-level', { params })
  },

  /**
   * 获取未来一小时预测人流量（Foresight 功能）
   * GET /pedestrian/forecast
   * @param {Object} params - { sensorId?, lat?, lng? }
   * @returns {Promise<Array<{ hour, predictedCount, level }>>}
   */
  getForecast(params) {
    return client.get('/pedestrian/forecast', { params })
  }
}
