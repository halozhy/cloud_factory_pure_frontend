// src/mock/index.js
import axios from 'axios'
import {controller} from '@/mock/mockController.js'

// 模拟静态数据
const mockData = {
  '/api/user/loginNew': { data: 0, userId: 1, username: 'admin', type: '超级管理员' },
  '/api/user/list': require('@/mock/user/list.json'),
  '/api/user': { id: 1, name: 'Mock User' },
  '/api/list': [{ id: 1, title: 'Mock Item 1' }, { id: 2, title: 'Mock Item 2' }]
}

// 在 request 拦截器中直接进行 Promise.reject 避免真正发送网络请求
axios.interceptors.request.use(config => {
  const url = config.url
  if (mockData[url]) {
    console.log('in request mock', url)
    const mockError = new Error()
    mockError.config = config
    return Promise.reject(mockError)
  }
  return config
})

// 在 response 拦截器中返回mock数据，此时在error里面对error进行mock处理即可
axios.interceptors.response.use((response) => response, async error => {
  const config = error.config
  const url = config.url
  // 如果请求的 URL 在 mockData 中存在，则返回模拟数据
  if (mockData[url]) {
    console.log('in response mock', url)
    const controller_result = await controller(url, config)
    return Promise.resolve({
      data: controller_result == null ? mockData[url] : controller_result,
      status: 200,
      statusText: 'OK',
      config: config,
      headers: {}
    })
  }

  // 如果不存在，继续发送请求
  return error
})

// 导出 axios 实例
export default axios
