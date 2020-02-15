import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 检查路由是否包含 meta 和 meta.roles 属性
  if (route.meta && route.meta.roles) {
    // 判断 route.meta.roles 中是否包含用户角色 roles 中的任何一个权限，如果包含则返回 true，否则为 false
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果路由没有 meta 或 meta.roles 属性，则视为该路由不需要进行权限控制，所有用户对该路由都具有访问权限
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes 异步加载的路由
 * @param roles 用户的角色，数组形式
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // 遍历全部路由
  routes.forEach(route => {
    // 对路由进行浅拷贝，注意 children 不会拷贝，因为不需要对 children 进行判断，所以可以使用浅拷贝
    const tmp = { ...route }
    // 检查用户角色是否具备访问路由的权限
    if (hasPermission(roles, tmp)) {
      // 当路由具有访问权限时，判断路由是否具备 children 属性
      if (tmp.children) {
        // 当路由包含 children 时，对 children 迭代调用 filterAsyncRoutes 方法
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 当路由具有访问权限时，将 tmp 保存到 res 中
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 将 routes 保存到 state 中的 addRoutes
    state.addRoutes = routes
    // 将 routes 集成到 src/router/index.js 的 constantRoutes 中
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // 返回 Promise 对象
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // 如果角色中包含 admin，则直接跳过判断，直接将 asyncRoutes 全部返回
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果角色中没有包含 admin，则调用 filterAsyncRoutes 过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 将路由保存到 vuex 中
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
