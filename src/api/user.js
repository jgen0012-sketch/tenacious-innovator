/**
 * 用户账户 & 感官偏好 API
 */
import client from './client'

export const userApi = {
  /**
   * 用户注册
   * POST /users/register
   * @param {{ name, email, password }} body
   */
  register(body) {
    return client.post('/users/register', body)
  },

  /**
   * 用户登录，返回 JWT token
   * POST /users/login
   * @param {{ email, password }} credentials
   * @returns {Promise<{ token, user }>}
   */
  async login(credentials) {
    const data = await client.post('/users/login', credentials)
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }
    return data
  },

  /**
   * 登出，清除 token
   * POST /users/logout
   */
  async logout() {
    await client.post('/users/logout').catch(() => {})
    localStorage.removeItem('auth_token')
  },

  /**
   * 获取当前用户信息
   * GET /users/me
   */
  getProfile() {
    return client.get('/users/me')
  },

  /**
   * 更新感官偏好配置
   * PUT /users/me/preferences
   * @param {{ crowdThreshold, noiseThreshold, preferIndoor, maxWalkingDistance, alertsEnabled }} prefs
   */
  updatePreferences(prefs) {
    return client.put('/users/me/preferences', prefs)
  },

  /**
   * 获取用户历史路线记录
   * GET /users/me/history
   */
  getRouteHistory() {
    return client.get('/users/me/history')
  },

  /**
   * 保存用户收藏的避难场所
   * POST /users/me/saved-refuges
   * @param {{ landmarkId }} body
   */
  saveRefuge(body) {
    return client.post('/users/me/saved-refuges', body)
  },

  /**
   * 获取用户收藏的避难场所列表
   * GET /users/me/saved-refuges
   */
  getSavedRefuges() {
    return client.get('/users/me/saved-refuges')
  }
}
