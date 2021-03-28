import { createContext } from 'react'

// initialUserContext
// user profile
export const initialUserContext = {
  token: null,
  refresh_token: null,
  userProfile: {
    userId: 0,
    username: '',
    email: '',
    firstName: 'User',
    lastName: '',
  },
  alerts: [],
  isAuthorized: false,
  assetEquities: [],
  watchedEquities: [],
  accountBalance: 6010.00,
  setContext: () => {}, // - context updater function
}

// create USER context object
export const UserContext = createContext(initialUserContext)
