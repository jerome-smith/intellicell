/**
 * # reducers
 *
 * This class combines all the reducers into one
 *
 */
'use strict'
/**
 * ## Imports
 *
 * our 7 reducers
 */
import auth from './auth/authReducer'
import device from './device/deviceReducer'
import global from './global/globalReducer'
import profile from './profile/profileReducer'
import chatroom from './chat/chatroom'
import user from './chat/user'
import messages from  './chat/messages'
import { combineReducers } from 'redux'

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const rootReducer = combineReducers({
  auth,
  device,
  global,
  profile,
  chatroom,
  user
})

export default rootReducer
