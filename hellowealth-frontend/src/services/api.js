import 'isomorphic-unfetch'
import { objectToFormData } from 'object-to-formdata'

// server2: http://ec2-18-207-234-102.compute-1.amazonaws.com/api/
// live server: https://cors-everywhere-me.herokuapp.com/http://ec2-18-207-234-102.compute-1.amazonaws.com/api/
// Use this cors-everywhere-me to by pass the https withou setup ssl with official certificate
export const API_BASE = 'http://localhost:8000/api/'
export const ENDPOINTS = {
  login: `${API_BASE}rest-auth/login/`,
  logout: `${API_BASE}rest-auth/logout/`,
  signUp: `${API_BASE}rest-auth/registration/`,
  user: `${API_BASE}rest-auth/user/`,
  changePassword: `${API_BASE}rest-auth/password/change/`,
  resetPassword: `${API_BASE}rest-auth/password/reset/`,
  newPassword: `${API_BASE}rest-auth/password/reset/confirm/`,
  verifyToken: `${API_BASE}rest-auth/token/verify/`,
  refreshToken: `${API_BASE}rest-auth/token/refresh/`,
  userPorfolio: `${API_BASE}porfolio/`,
  userTransaction: `${API_BASE}transaction/`,
  stockPrediction: `${API_BASE}prediction/`,
}

const APIKEY = 'API_KEY'
export const FIN_API = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/'
export const FIN_ENPOINTS = {
  autoComplete: `${FIN_API}auto-complete/`,
  getSummary: `${FIN_API}stock/v2/get-summary/`,
  getPriceHistory: `${FIN_API}stock/v3/get-historical-data/`,
}

export const checkStatus = (response) => {
  if (!response.ok && response.statusText) {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  } else if (!response.ok && response.non_field_errors) {
    const error = new Error(response.non_field_errors)
    error.response = response
    throw error
  }
  return response
}

export const parseJSON = (response) => {
  return response.text().then((text) => {
    let resJson = {}

    if (
      typeof text == 'string' &&
      text &&
      typeof JSON.parse(text) !== 'string'
    ) {
      resJson = JSON.parse(text)
    }
    resJson.statusCode = response.status
    resJson.ok = response.ok
    return resJson
  })
}

export const urlBuilder = (url, options) => {
  if (!options) {
    return url
  }
  Object.keys(options).map((key) => {
    if (
      options[key] === null ||
      options[key] === '' ||
      options[key] === undefined
    ) {
      delete options[key]
    }

    return null
  })
  let esc = encodeURIComponent
  let query = Object.keys(options)
    .map((k) => esc(k) + '=' + esc(options[k].toString().replace('%26', '&'))) // replace the encoded character to prevent encode twice
    .join('&')
  url += '?' + query
  return url
}

// base api call
export const apiCall = async (
  url,
  data,
  method = 'get',
  hasFile = false,
  token = null,
  rapidApiKey = null
) => {
  console.log('-------api called-----', url)
  let fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: method.toUpperCase(),
  }
  let formattedData
  if (data) {
    if (hasFile) {
      // File uploads can't send as json - change to form
      formattedData = objectToFormData(data)
      delete fetchOptions.headers['Content-Type']
    } else {
      formattedData = JSON.stringify(data)
    }
  }

  if (token) {
    fetchOptions.headers['Authorization'] = `Bearer ${token}`
  }

  if (rapidApiKey) {
    fetchOptions.headers['x-rapidapi-key'] = rapidApiKey
    fetchOptions.headers['x-rapidapi-host'] =
      'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }

  if (formattedData) {
    fetchOptions.body = formattedData
  }
  return fetch(url, fetchOptions)
    .then((response) => {
      return checkStatus(response)
    })
    .then((response) => {
      return parseJSON(response)
    })
    .catch(async (error) => {
      const response = error.response
      if (response) {
        error = await parseJSON(response)
        error.statusCode = response.status
        error.ok = false
      }

      return error
    })
}

/* ================================ Stating our APIs ============================= */

// login
export const login = async (email, password) => {
  return await apiCall(
    ENDPOINTS.login,
    { username: email, password: password },
    'post'
  )
}

// verify token
export const checkAccess = async (storedToken) => {
  return await apiCall(ENDPOINTS.verifyToken, { token: storedToken }, 'post')
}

// refresh token
export const refreshAccess = async (refreshToken) => {
  return await apiCall(
    ENDPOINTS.refreshToken,
    { refresh: refreshToken },
    'post'
  )
}

// user data
export const getUser = async (token) => {
  return await apiCall(ENDPOINTS.user, null, 'get', false, token)
}

// logout
export const logout = async () => {
  return await apiCall(ENDPOINTS.logout, {}, 'post')
}

// logout
export const signUp = async (data) => {
  return await apiCall(ENDPOINTS.signUp, data, 'post')
}

// update user data
export const updateUser = async (token, userData) => {
  return await apiCall(ENDPOINTS.user, userData, 'patch', false, token)
}

// get user porfolio
export const getUserPorfolio = async (token) => {
  return await apiCall(ENDPOINTS.userPorfolio, null, 'get', false, token)
}

// create user porfolio
export const createUserPorfolio = async (token, userData) => {
  return await apiCall(ENDPOINTS.userPorfolio, userData, 'post', false, token)
}

// update user porfolio
export const updateUserPorfolio = async (token, userData) => {
  return await apiCall(ENDPOINTS.userPorfolio, userData, 'put', false, token)
}

// get user transaction
export const getUserTrans = async (token) => {
  return await apiCall(ENDPOINTS.userTransaction, null, 'get', false, token)
}

// create user transaction
export const createUserTrans = async (token, userData) => {
  return await apiCall(
    ENDPOINTS.userTransaction,
    userData,
    'post',
    false,
    token
  )
}

// get stock prediction
export const getStockPrediction = async (token, symbol = '') => {
  return await apiCall(`${ENDPOINTS.stockPrediction}${symbol}`, null, 'get', false, token)
}

/* ================================ Financial APIs ============================= */

// get equities auto-complete
export const symbolNameAutoComplete = async (params) => {
  return await apiCall(
    urlBuilder(FIN_ENPOINTS.autoComplete, { ...params }),
    null,
    'get',
    false,
    null,
    APIKEY
  )
}

// get equity summary
export const getEquitySummary = async (params) => {
  return await apiCall(
    urlBuilder(FIN_ENPOINTS.getSummary, { ...params }),
    null,
    'get',
    false,
    null,
    APIKEY
  )
}

// get equity price history since last year
export const getEquityPriceHistory = async (params) => {
  return await apiCall(
    urlBuilder(FIN_ENPOINTS.getPriceHistory, { ...params }),
    null,
    'get',
    false,
    null,
    APIKEY
  )
}

// get candle stick chart dataset
//https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart?interval=5m&symbol=AMRN&range=1d&region=US
// get recommend: https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-recommendations?symbol=INTC
