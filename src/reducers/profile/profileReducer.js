/**
 * # profileReducer.js
 *
 * The reducer user profile actions
 */
'use strict'

/**
 * ## Imports
 *
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const fieldValidation = require('../../lib/fieldValidation').default
const formValidation = require('./profileFormValidation').default

/**
 * ## Actions
 *
 */
const {
  ON_PROFILE_FORM_FIELD_CHANGE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  LOGOUT_SUCCESS,

  SET_STATE
} = require('../../lib/constants').default

/**
 * ## Initial State
 *
 */
const InitialState = require('./profileInitialState').default
const initialState = new InitialState()

/**
 * ## profileReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function profileReducer (state = initialState, action) {
  let nextProfileState = null

  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    /**
     * ### Request starts
     * set the form to fetching and clear any errors
     */
    case GET_PROFILE_REQUEST:
    case PROFILE_UPDATE_REQUEST:
      return state.setIn(['form', 'isFetching'], true)
      .setIn(['form', 'error'], null)

    /**
     * ### Request end successfully
     * set the form to fetching as done
     */
    case PROFILE_UPDATE_SUCCESS:
      return state.setIn(['form', 'isFetching'], false)

    /**
     * ### Request ends successfully
     *
     * the fetching is done, set the UI fields and the originalProfile
     *
     * Validate the data to make sure it's all good and someone didn't
     * mung it up through some other mechanism
     */


    case GET_PROFILE_SUCCESS:
      nextProfileState = state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'fields', 'username'], action.payload.username)
      .setIn(['form', 'fields', 'firstname'], action.payload.firstname)
      .setIn(['form', 'fields', 'lastname'], action.payload.lastname)
      .setIn(['form', 'fields', 'bankname'], action.payload.bankname)
      .setIn(['form', 'fields', 'accountnumber'], action.payload.accountnumber)
      .setIn(['form', 'fields', 'accounttype'], action.payload.accounttype)
      .setIn(['form', 'fields', 'branchcode'], action.payload.branchcode)
      .setIn(['form', 'fields', 'email'], action.payload.email)
      .setIn(['form', 'fields', 'emailVerified'],
             action.payload.emailVerified)
      .setIn(['form', 'originalProfile', 'username'], action.payload.username)
      .setIn(['form', 'originalProfile', 'firstname'], action.payload.firstname)
      .setIn(['form', 'originalProfile', 'lastname'], action.payload.lastname)
      .setIn(['form', 'originalProfile', 'bankname'], action.payload.bankname)
      .setIn(['form', 'originalProfile', 'accountnumber'], action.payload.accountnumber)
      .setIn(['form', 'originalProfile', 'accounttype'], action.payload.accounttype)
      .setIn(['form', 'originalProfile', 'branchcode'], action.payload.branchcode)
      .setIn(['form', 'originalProfile', 'email'], action.payload.email)
      .setIn(['form', 'originalProfile', 'emailVerified'], action.payload.emailVerified)
      .setIn(['form', 'originalProfile', 'objectId'], action.payload.objectId)
      .setIn(['form', 'error'], null)

      return formValidation(
      fieldValidation(nextProfileState, action)
      , action)

    /**
     * User logged out, so reset form fields and original profile.
     *
     */
    case LOGOUT_SUCCESS:
      nextProfileState = state.setIn(['form', 'fields', 'username'], '')
      .setIn(['form', 'fields', 'firstname'], '')
      .setIn(['form', 'fields', 'lastname'], '')
      .setIn(['form', 'fields', 'bankname'], '')
      .setIn(['form', 'fields', 'accountnumber'], '')
      .setIn(['form', 'fields', 'accounttype'], '')
      .setIn(['form', 'fields', 'branchcode'], '')
      .setIn(['form', 'fields', 'email'], '')
      .setIn(['form', 'fields', 'emailVerified'], false)
      .setIn(['form', 'originalProfile', 'firstname'], '')
      .setIn(['form', 'originalProfile', 'lastname'], '')
      .setIn(['form', 'originalProfile', 'bankname'], '')
      .setIn(['form', 'originalProfile', 'accountnumber'], '')
      .setIn(['form', 'originalProfile', 'accounttype'], '')
      .setIn(['form', 'originalProfile', 'branchcode'], '')
      .setIn(['form', 'originalProfile', 'username'], '')
      .setIn(['form', 'originalProfile', 'email'], '')
      .setIn(['form', 'originalProfile', 'emailVerified'], false)
      .setIn(['form', 'originalProfile', 'objectId'], null)
      .setIn(['form', 'error'], null)
      return formValidation(nextProfileState, action)

    /**
     * ### Request fails
     * we're done fetching and the error needs to be displayed to the user
     */
    case GET_PROFILE_FAILURE:
    case PROFILE_UPDATE_FAILURE:
      return state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'error'], action.payload)

    /**
     * ### form fields have changed
     *
     * Set the state with the fields, clear the form error
     * and perform field and form validation
     */
    case ON_PROFILE_FORM_FIELD_CHANGE: {
      const {field, value} = action.payload
      let nextState = state
          .setIn(['form', 'fields', field], value)
          .setIn(['form', 'error'], null)

      return formValidation(
        fieldValidation(nextState, action),
        action
      )
    }

    /**
     * ### set the state
     *
     * This is in support of Hot Loading - take the payload
     * and set the values into the state
     *
     */
    case SET_STATE:
      var profile = JSON.parse(action.payload).profile.form
      var next = state.setIn(['form', 'disabled'], profile.disabled)
          .setIn(['form', 'error'], profile.error)
          .setIn(['form', 'isValid'], profile.isValid)
          .setIn(['form', 'isFetching'], profile.isFetching)
          .setIn(['form', 'originalProfile',
                  'username'], profile.originalProfile.username)
          .setIn(['form', 'originalProfile',
                  'firstname'], profile.originalProfile.firstname)
          .setIn(['form', 'originalProfile',
                  'lastname'], profile.originalProfile.lastname)
          .setIn(['form', 'originalProfile',
                  'bankname'], profile.originalProfile.bankname)
          .setIn(['form', 'originalProfile',
                  'accountnumber'], profile.originalProfile.accountnumber)
          .setIn(['form', 'originalProfile',
                  'accounttype'], profile.originalProfile.accounttype)
          .setIn(['form', 'originalProfile',
                  'branchcode'], profile.originalProfile.branchcode)
          .setIn(['form', 'originalProfile',
                  'email'], profile.originalProfile.email)
          .setIn(['form', 'originalProfile',
                  'objectId'], profile.originalProfile.objectId)
          .setIn(['form', 'originalProfile',
                  'emailVerified'], profile.originalProfile.emailVerified)
          .setIn(['form', 'fields',
                  'username'], profile.fields.username)
          .setIn(['form', 'originalProfile',
                  'firstname'], profile.fields.firstname)
          .setIn(['form', 'originalProfile',
                  'lastname'], profile.fields.lastname)
          .setIn(['form', 'originalProfile',
                  'bankname'], profile.fields.bankname)
          .setIn(['form', 'originalProfile',
                  'accountnumber'], profile.fields.accountnumber)
          .setIn(['form', 'originalProfile',
                  'accounttype'], profile.fields.accounttype)
          .setIn(['form', 'originalProfile',
                  'branchcode'], profile.fields.branchcode)
          .setIn(['form', 'fields',
                  'usernameHasError'], profile.fields.usernameHasError)
          .setIn(['form', 'fields',
                  'email'], profile.fields.email)
          .setIn(['form', 'fields',
                  'emailHasError'], profile.fields.emailHasError)
          .setIn(['form', 'fields',
                  'emailVerified'], profile.fields.emailVerified)
      return next

  }// switch
  /**
   * # Default
   */
  return state
}
