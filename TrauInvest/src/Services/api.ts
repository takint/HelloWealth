import { Config } from '@/Config'
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { replaceSmartPunctuation } from './helpers'

type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
type LoadingStatus = 'loading' | 'reloading' | 'success' | 'fail'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const baseQuery = fetchBaseQuery({ baseUrl: Config.API_URL })

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
})

export const buildUrl = (url: string, params?: any) => {
  if (!params) {
    return url
  }

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === null || value === undefined || value === '') {
      delete params[key]
    }
  })

  const query = Object.keys(params)
    .map(
      k =>
        encodeURIComponent(k) +
        '=' +
        encodeURIComponent(replaceSmartPunctuation(params[k])),
    )
    .join('&')

  return `${url}?${query}`
}

export const buildHeader = (
  method: HttpMethod,
  body?: any,
  authToken?: string,
) => {
  return {
    method,
    headers: {
      ...defaultHeaders,
      Authorization: authToken ? `JWT ${authToken}` : undefined,
    },
    body: body ? JSON.stringify(body) : undefined,
  } as RequestInit
}

export const deleteApiData = async (
  url: string,
  body?: any,
  authToken?: string,
) => {
  return await fetch(url, buildHeader('DELETE', body, authToken))
}

export const patchApiData = async (
  url: string,
  body?: any,
  authToken?: string,
) => {
  return await fetch(url, buildHeader('PATCH', body, authToken))
}

export const postApiData = async (
  url: string,
  body?: any,
  authToken?: string,
) => {
  return await fetch(url, buildHeader('POST', body, authToken))
}

export const getApiData = async (
  url: string,
  params?: any,
  authToken?: string,
) => {
  const res = await fetch(
    buildUrl(url, params),
    buildHeader('GET', null, authToken),
  )
  const data = await res.json()
  if (res.ok) {
    return data
  } else {
    throw new Error(res.statusText)
  }
}

export const getNewsFromYahoo = async () => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'text/plain',
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
      'X-RapidAPI-Key': 'zcvxJsWzSufs6KeNMbpauritS1UTGh2h'
    },
    body: null
  };
  return await fetch('https://yh-finance.p.rapidapi.com/news/v2/list?region=US&snippetCount=28', options)
}
