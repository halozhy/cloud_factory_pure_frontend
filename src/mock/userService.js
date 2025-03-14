// 用户服务类
export class UserService {
  constructor(db) {
    this.db = db;
  }

  // 添加用户
  async addUser(user, factory, type_int) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users', 'factories'], 'readwrite');
      const userStore = transaction.objectStore('users');
      const factoryStore = transaction.objectStore('factories');

      const usernameIndex = userStore.index('uUsername');
      const usernameRequest = usernameIndex.get(user.uUsername);

      usernameRequest.onsuccess = function (event) {
        if (event.target.result) {
          resolve(-1); // username 重复
        } else {
          if (type_int === 1) {
            user.uType = '云工厂管理员';
            const factoryRequest = factoryStore.add(factory);
            factoryRequest.onsuccess = function (event) {
              user.uFactoryId = event.target.result;
              const userRequest = userStore.add(user);
              userRequest.onsuccess = function () {
                resolve(0);
              };
              userRequest.onerror = function (event) {
                reject(event.target.error);
              };
            };
            factoryRequest.onerror = function (event) {
              reject(event.target.error);
            };
          } else if (type_int === 2) {
            user.uType = '经销商';
            const userRequest = userStore.add(user);
            userRequest.onsuccess = function () {
              resolve(0);
            };
            userRequest.onerror = function (event) {
              reject(event.target.error);
            };
          }
        }
      };

      usernameRequest.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  // 登录
  async login(username, password) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const userStore = transaction.objectStore('users');
      const usernameIndex = userStore.index('usernameIndex');

      const request = usernameIndex.getAll();
      let result = {
        data: -1
      }
      request.onsuccess = function (event) {
        const users = event.target.result;
        const matchedUser = users.find(user => user.username === username);
        if (matchedUser != null) {
          if (matchedUser.password === password) {
            result.data = 0
          }
          else {
            result.data = -3
          }
          result = Object.assign(result, matchedUser)
        }
        resolve(result);
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  // 删除用户
  async deleteById(uId) {
    // 这里暂时不处理订单相关逻辑
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users', 'factories'], 'readwrite');
      const userStore = transaction.objectStore('users');
      const factoryStore = transaction.objectStore('factories');

      const userRequest = userStore.get(uId);
      userRequest.onsuccess = function (event) {
        const user = event.target.result;
        if (!user) {
          resolve(-2); // 无此用户
        } else {
          if (user.uType === '云工厂管理员') {
            const factoryRequest = factoryStore.delete(user.uFactoryId);
            factoryRequest.onsuccess = function () {
              const deleteUserRequest = userStore.delete(uId);
              deleteUserRequest.onsuccess = function () {
                resolve(0);
              };
              deleteUserRequest.onerror = function (event) {
                reject(event.target.error);
              };
            };
            factoryRequest.onerror = function (event) {
              reject(event.target.error);
            };
          } else {
            const deleteUserRequest = userStore.delete(uId);
            deleteUserRequest.onsuccess = function () {
              resolve(0);
            };
            deleteUserRequest.onerror = function (event) {
              reject(event.target.error);
            };
          }
        }
      };

      userRequest.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  // 分页查询用户
  async listUser(page, limit, id, username, name) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users', 'factories'], 'readonly');
      const userStore = transaction.objectStore('users');
      const factoryStore = transaction.objectStore('factories');

      const users = [];
      const request = userStore.openCursor();
      request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const user = cursor.value;
          if ((!id || user.uId.toString().includes(id)) &&
            (!username || user.uUsername.includes(username)) &&
            (!name || user.uName.includes(name))) {
            users.push(user);
          }
          cursor.continue();
        } else {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedUsers = users.slice(startIndex, endIndex);

          const userVoList = [];
          paginatedUsers.forEach(user => {
            const userVo = {
              id: user.uId,
              username: user.uUsername,
              password: user.uPassword,
              name: user.uName,
              contact: user.uContact,
              type: user.uType
            };
            if (user.uFactoryId) {
              const factoryRequest = factoryStore.get(user.uFactoryId);
              factoryRequest.onsuccess = function (event) {
                const factory = event.target.result;
                if (factory) {
                  userVo.fac_id = factory.fId;
                  userVo.fac_name = factory.fName;
                  userVo.fac_describe = factory.fDescribe;
                }
              };
              factoryRequest.onerror = function (event) {
                reject(event.target.error);
              };
            }
            userVoList.push(userVo);
          });

          const result = {
            data: userVoList,
            count: users.length
          };
          resolve(result);
        }
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }
}