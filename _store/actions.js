/*Services*/
import service from '@imagina/qmenu/_services/index'

export const GET_DEFAULT_MENU = ({ commit, state, dispatch }, criteria, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await service.crud.show('apiRoutes.qmenu.menus', criteria, params)
      .then(response => {
        commit('SET_DEFAULT_MENU',  response.data)
        resolve(true)
      })
      .catch(error=>{
        reject(error)
      })
  })
}

export const GET_MENUS = ({ commit, state, dispatch }, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await service.crud.index('apiRoutes.qmenu.menus', params)
      .then(response => {
        commit('SET_MENUS',  response.data)
        resolve(true)
      })
      .catch(error=>{
        reject(error)
      })
  })
}

export const GET_MENU_ITEMS = ({ commit, state, dispatch }, params = {}) => {
  return new Promise(async (resolve, reject) => {
    await service.crud.index('apiRoutes.qmenu.menuItems', params)
      .then(response => {
        commit('SET_MENU_ITEMS', response.data)
        resolve(true)
      })
      .catch(error=>{
        reject(error)
      })
  })
}

