import axios from 'axios'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截：自动附带 auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：统一错误处理
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unknown API error'
    console.error('[API Error]', message)
    return Promise.reject(new Error(message))
  }
)

export default client
