/**
 * 地标与兴趣点 API
 * 数据来源: City of Melbourne – Landmarks and places of interest
 *   包含: 学校、剧院、健康服务、运动设施、宗教场所、画廊、博物馆
 */
import client from './client'

export const landmarksApi = {
  /**
   * 获取所有地标列表
   * GET /landmarks
   * @param {Object} params - { bbox?: '南纬,西经,北纬,东经', type?, limit? }
   * @returns {Promise<Array<{ id, name, type, lat, lng, address, description }>>}
   */
  getLandmarks(params = {}) {
    return client.get('/landmarks', { params })
  },

  /**
   * 获取附近安静避难空间（公园、图书馆、咖啡馆等低感官刺激场所）
   * GET /landmarks/refuges/nearby
   * @param {number} lat
   * @param {number} lng
   * @param {number} radiusMeters - 搜索半径（默认500m）
   * @returns {Promise<Array<{ id, name, type, lat, lng, distance, crowdLevel }>>}
   */
  getNearbyRefuges(lat, lng, radiusMeters = 500) {
    return client.get('/landmarks/refuges/nearby', {
      params: { lat, lng, radius: radiusMeters }
    })
  },

  /**
   * 获取单个地标详情
   * GET /landmarks/:id
   * @param {string|number} id
   * @returns {Promise<{ id, name, type, lat, lng, address, openingHours, crowdLevel }>}
   */
  getLandmarkById(id) {
    return client.get(`/landmarks/${id}`)
  },

  /**
   * 获取地标类型列表（用于筛选）
   * GET /landmarks/types
   * @returns {Promise<Array<string>>}
   */
  getLandmarkTypes() {
    return client.get('/landmarks/types')
  }
}
