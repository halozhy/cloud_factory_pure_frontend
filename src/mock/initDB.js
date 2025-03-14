// 初始化IndexedDB
export async function initDB() {
  const request = indexedDB.open('cloud_factory', 1);

  request.onupgradeneeded = function (event) {
    console.log('需要初始化indexedDB');

    const db = event.target.result;

    // 创建用户对象存储空间
    const userStore = db.createObjectStore('users', { keyPath: 'uId', autoIncrement: true });
    userStore.createIndex('usernameIndex', 'username', { unique: true });

    // 添加用户示例
    const user = {
      userId: 1,
      username: 'admin',
      password: 'admin',
      name: 'Admin',
      contact: '123456789',
      type: '超级管理员',
    };
    const type_int = 0;
    const usernameIndex = userStore.index('usernameIndex');
    const usernameRequest = usernameIndex.get(user.username);

    usernameRequest.onsuccess = function (event) {
      if (event.target.result) {
        console.log('username 重复');

        resolve(-1); // username 重复
      } else {
        const userRequest = userStore.add(user);
        userRequest.onsuccess = function () {
          // resolve(0);
          console.log('默认user admin添加成功');
        };
        userRequest.onerror = function (event) {
          reject(event.target.error);
        };
        // if (type_int === 1) {
        //     user.uType = '云工厂管理员';
        //     const factoryRequest = factoryStore.add(factory);
        //     factoryRequest.onsuccess = function (event) {
        //         user.uFactoryId = event.target.result;
        //         const userRequest = userStore.add(user);
        //         userRequest.onsuccess = function () {
        //             resolve(0);
        //         };
        //         userRequest.onerror = function (event) {
        //             reject(event.target.error);
        //         };
        //     };
        //     factoryRequest.onerror = function (event) {
        //         reject(event.target.error);
        //     };
        // } else if (type_int === 2) {
        //     user.uType = '经销商';
        //     const userRequest = userStore.add(user);
        //     userRequest.onsuccess = function () {
        //         resolve(0);
        //     };
        //     userRequest.onerror = function (event) {
        //         reject(event.target.error);
        //     };
        // }
      }
    };

    usernameRequest.onerror = function (event) {
      reject(event.target.error);
    };


    // 创建工厂对象存储空间
    const factoryStore = db.createObjectStore('factories', { keyPath: 'fId', autoIncrement: true });

    // 创建设备对象存储空间
    const deviceStore = db.createObjectStore('devices', { keyPath: 'dId', autoIncrement: true });
  };


  // const factory = {
  //     fId: 'Test Factory',
  //     fName: 'Test Factory',
  //     fDescribe: 'This is a test factory',
  //     fState: '正常'
  // };


  // const userStore = transaction.objectStore('users');
  // const factoryStore = transaction.objectStore('factories');



  // console.log('Add user result:', addUserResult);

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}