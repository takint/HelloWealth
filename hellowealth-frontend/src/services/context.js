import { createContext } from 'react'

// initialUserContext
// user profile
export const initialUserContext = {
  token: null,
  userProfile: { userId: null, name: '', email: '', image: null },
  alerts: [],
  assetEquities: [],
  watchedEquities: [],
  accountBalance: 0,
  setContext: () => {}, // - context updater function
}

// create USER context object
export const UserContext = createContext(initialUserContext)
