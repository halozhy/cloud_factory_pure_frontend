import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const baseRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const suAdminRoutes = [

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/admin/userMgr',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'userMgr',
        component: () => import('@/views/admin/user-mgr'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/admin/facMgr',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'facMgr',
        component: () => import('@/views/admin/fac-mgr'),
        meta: { title: '工厂管理', icon: 'el-icon-s-management' }
      }
    ]
  },
  {
    path: '/admin/device',
    component: Layout,
    redirect: '/admin/device/deviceMgr',
    name: 'device',
    meta: { title: '设备管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'deviceMgr',
        name: 'deviceMgr',
        component: () => import('@/views/admin/device/device-mgr'),
        meta: { title: '设备管理', icon: 'table' }
      },
      {
        path: 'deviceTypeMgr',
        name: 'deviceTypeMgr',
        component: () => import('@/views/admin/device/device-type-mgr'),
        meta: { title: '设备类型管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/deviceCap/deviceCapMgr',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        name: 'deviceCapMgr',
        component: () => import('@/views/device-cap/device-cap-mgr'),
        meta: { title: '产能配置', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/admin/product',
    component: Layout,
    redirect: '/admin/product/productMgr',
    name: 'product',
    meta: { title: '产品管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'productMgr',
        name: 'productMgr',
        component: () => import('@/views/admin/product/product-mgr'),
        meta: { title: '产品管理', icon: 'table' }
      },
      {
        path: 'productTypeMgr',
        name: 'productTypeMgr',
        component: () => import('@/views/admin/product/product-type-mgr'),
        meta: { title: '产品类型管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/admin/OrderMgr',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'OrderMgr',
        component: () => import('@/views/admin/order-mgr'),
        meta: { title: '订单管理', icon: 'el-icon-s-help' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const facAdminRoutes = [

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/fac/deviceMgr',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'devicerMgr',
        component: () => import('@/views/fac/device-mgr'),
        meta: { title: '我的工厂', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/deviceCap/deviceCapMgr',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        name: 'deviceCapMgr',
        component: () => import('@/views/device-cap/device-cap-mgr'),
        meta: { title: '产能配置', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/fac/facOrderMgr',
    component: Layout,
    name: 'Order',
    meta: { title: '订单管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'bid',
        name: 'FacOrderBid',
        component: () => import('@/views/fac/fac-order-bid'),
        meta: { title: '订单接单', icon: 'el-icon-s-help' }
      },
      {
        path: 'mgr',
        name: 'FacOrderMgr',
        component: () => import('@/views/fac/fac-order-mgr'),
        meta: { title: '订单排产', icon: 'el-icon-s-help' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const dealerRoutes = [

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/dealer/dealerOrderMgr',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DealerOrderMgr',
        component: () => import('@/views/dealer/dealer-order-mgr'),
        meta: { title: '订单管理', icon: 'table' }
      }

    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // routes: constantRoutes
  routes: baseRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
