import 'isomorphic-unfetch'
import { objectToFormData } from 'object-to-formdata'

// server: http://ec2-3-214-215-160.compute-1.amazonaws.com/
export const API_BASE = 'http://ec2-3-214-215-160.compute-1.amazonaws.com/api/'
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
}

const APIKEY = 'zcvxJsWzSufs6KeNMbpauritS1UTGh2h'
export const FIN_API = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/'
export const FIN_ENPOINTS = {
  autoComplete: `${FIN_API}auto-complete/`,
  getSummary: `${FIN_API}stock/v2/get-summary/`,
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
  return await apiCall(ENDPOINTS.user, userData , 'patch', false, token)
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
