import { initDB } from '@/mock/initDB.js'
import { UserService } from '@/mock/userService.js'

export async function controller(url, config) {
  // 登录
  if (url === '/api/user/loginNew') {
    const db = await initDB();
    const userService = new UserService(db);
    const loginResult = await userService.login(config.data.username, config.data.password);
    console.log('Login result:', loginResult);
    return loginResult
  }
}