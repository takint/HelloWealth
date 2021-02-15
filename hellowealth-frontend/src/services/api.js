import 'isomorphic-unfetch'
import { objectToFormData } from 'object-to-formdata'

export const API_BASE = 'http://localhost:8000/api/'
export const ENDPOINTS = {
  login: `${API_BASE}rest-auth/login/`,
  logout: `${API_BASE}rest-auth/logout/`,
  signUp: `${API_BASE}rest-auth/registration/`,
  user: `${API_BASE}rest-auth/user/`,
  changePassword: `${API_BASE}rest-auth/password/change/`,
  resetPassword: `${API_BASE}rest-auth/password/reset/`,
  newPassword: `${API_BASE}rest-auth/password/reset/confirm/`,
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

// base api call
export const apiCall = async (
  url,
  data,
  method = 'get',
  hasFile = false,
  token = null
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
    fetchOptions.headers['Authorization'] = `JWT ${token}`
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
    { email: email, password: password },
    'post'
  )
}

// logout
export const logout = async () => {
  return await apiCall(ENDPOINTS.logout, {}, 'post')
}
