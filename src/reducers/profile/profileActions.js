/**
 * # profileActions.js
 *
 * The actions to support the users profile
 */
'use strict'
/**
 * ## Imports
 *
 * The actions for profile
 */
const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_PROFILE_FORM_FIELD_CHANGE
} = require('../../lib/constants').default
import _ from 'lodash'

/**
 * BackendFactory - base class for server implementation
 * AppAuthToken for localStorage sessionToken access
 */
// const FireBaseFactory = require('../../lib/FireBaseFactory').default
import firebase from 'firebase'
import {appAuthToken} from '../../lib/AppAuthToken'

/**
 * ## retreiving profile actions
 */
export function getProfileRequest () {
  return {
    type: GET_PROFILE_REQUEST
  }
}
export function getProfileSuccess (json) {
  console.log(json,'MYSON')
  return {
    type: GET_PROFILE_SUCCESS,
    payload: json
  }
}
export function getProfileFailure (json) {
  return {
    type: GET_PROFILE_FAILURE,
    payload: json
  }
}
/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */
export function getProfile (sessionToken) {
  return dispatch => {
    dispatch(getProfileRequest())
    // store or get a sessionToken
    // people shouldbe bank details
    return appAuthToken.getSessionToken(sessionToken)
      .then((token) => {
        firebase.database().ref(`/users/${token.sessionToken.uid}/people`)
        .on('value', snapshot => {
          let p = _.keys(snapshot.val())[0]
          dispatch(getProfileSuccess(snapshot.val()[p]))
          return snapshot.val()[p]
        })
      })
      .catch((error) => {
        dispatch(getProfileFailure(error))
      })
  }
}
/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */
export function profileUpdateRequest () {
  return {
    type: PROFILE_UPDATE_REQUEST
  }
}
export function profileUpdateSuccess () {
  return {
    type: PROFILE_UPDATE_SUCCESS
  }
}
export function profileUpdateFailure (json) {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: json
  }
}
/**
 * ## updateProfile
 * @param {string} userId -  objectId
 * @param {string} username - the users name
 * @param {string] email - user's email
 * @param {Object} sessionToken - the sessionToken
 *
 * The sessionToken is provided when Hot Loading.
 *
 * With the sessionToken, the server is called with the data to update
 * If successful, get the profile so that the screen is updated with
 * the data as now persisted on the serverx
 *
 */
export function updateProfile (userId, username, email, sessionToken) {
  return dispatch => {
    dispatch(profileUpdateRequest())
    return appAuthToken.getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).updateProfile(userId,
          {
            username: username,
            email: email
          }
        )
      })
      .then(() => {
        dispatch(profileUpdateSuccess())
        dispatch(getProfile())
      })
      .catch((error) => {
        dispatch(profileUpdateFailure(error))
      })
  }
}
/**
 * ## onProfileFormFieldChange
 *
 */
export function onProfileFormFieldChange (field, value) {
  return {
    type: ON_PROFILE_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  }
}
