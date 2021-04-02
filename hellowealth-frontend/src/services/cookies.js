import cookie from 'js-cookie'

export const setCookie = (key, value, expires) => {
  cookie.set(key, value, {
    expires: expires || 1,
    path: '/',
  })
}

export const removeCookie = (key) => {
  cookie.remove(key, {
    expires: 1,
  })
}

export const getCookie = (key) => {
  return getCookieFromBrowser(key)
}

const getCookieFromBrowser = (key) => {
  return cookie.get(key)
}

export const JWT_COOKIE = 'jwt'
export const NOT_SHOW_POPUP_COOKIE = 'not_show_popup'
