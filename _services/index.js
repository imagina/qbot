import crud from '@imagina/qhelper/_services/baseService'
import http from "axios"
import config from 'src/config/index'

export default {
  crud,
  deleteIntent(configName, criteria, project, params) {
    return new Promise((resolve, reject) => {
      //Validations
      if (!configName) return reject('Config name is required')
      if (!criteria) return reject('Criteria is required')
      let urlApi = config(configName) + '/' + criteria + '/' + project // Get url from config
      let requestParams = (params && params.params) ? params.params : false//Get request params
      //Request
      http.delete(urlApi, requestParams).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },
}
