/**
 * # authActions.js
 *
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 *
 */
'use strict'

/**
 * ## Imports
 *
 * The actions supported
 */
const {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  LOGOUT,
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  ON_AUTH_FORM_FIELD_CHANGE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE

} = require('../../lib/constants').default

/**
 * Project requirements
 */
// const BackendFactory = require('../../lib/BackendFactory').default
import firebase from 'firebase'

import {Platform} from 'react-native'

import DeviceInfo from 'react-native-device-info';

import FCM, { FCMEvent, NotificationType, WillPresentNotificationResult, RemoteNotificationResult } from 'react-native-fcm';


import {Actions} from 'react-native-router-flux'

import {appAuthToken} from '../../lib/AppAuthToken'

const _ = require('lodash')

/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */

export function logoutState () {
  return {
    type: LOGOUT
  }
}
export function registerState () {
  return {
    type: REGISTER
  }
}

export function loginState () {
  return {
    type: LOGIN
  }
}

export function forgotPasswordState () {
  return {
    type: FORGOT_PASSWORD
  }
}

/**
 * ## Logout actions
 */
export function logoutRequest () {
  return {
    type: LOGOUT_REQUEST
  }
}

export function logoutSuccess () {
  return {
    type: LOGOUT_SUCCESS
  }
}
export function logoutFailure (error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  }
}
/**
 * ## Login
 * After dispatching the logoutRequest, get the sessionToken
 *
 *
 * When the response is received and it's valid
 * change the state to register and finish the logout
 *
 * But if the call fails, like expired token or
 * no network connection, just send the failure
 *
 * And if you fail due to an invalid sessionToken, be sure
 * to delete it so the user can log in.
 *
 * How could there be an invalid sessionToken?  Maybe they
 * haven't used the app for a long time.  Or they used another
 * device and logged out there.
 */
export function logout () {
  return dispatch => {
    dispatch(logoutRequest())
    return appAuthToken.getSessionToken()

      .then((token) => {
        firebase.auth().signOut().then(() => {
          dispatch(loginState())
          dispatch(logoutSuccess())
          dispatch(deleteSessionToken())
          Actions.InitialLoginForm()
        })
      })
      .catch((error) => {
        dispatch(loginState())
        dispatch(logoutFailure(error))
      })
  }
}
/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onAuthFormFieldChange (field, value) {
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  }
}
/**
 * ## Signup actions
 */
export function signupRequest () {
  return {
    type: SIGNUP_REQUEST
  }
}
export function signupSuccess (json) {
  return {
    type: SIGNUP_SUCCESS,
    payload: json
  }
}
export function signupFailure (error) {
  return {
    type: SIGNUP_FAILURE,
    payload: error
  }
}
/**
 * ## SessionToken actions
 */
export function sessionTokenRequest () {
  return {
    type: SESSION_TOKEN_REQUEST
  }
}
export function sessionTokenRequestSuccess (token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  }
}
export function sessionTokenRequestFailure (error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: _.isUndefined(error) ? null : error
  }
}

/**
 * ## DeleteToken actions
 */
export function deleteTokenRequest () {
  return {
    type: DELETE_TOKEN_REQUEST
  }
}
export function deleteTokenRequestSuccess () {
  return {
    type: DELETE_TOKEN_SUCCESS
  }
}

/**
 * ## Delete session token
 *
 * Call the AppAuthToken deleteSessionToken
 */
export function deleteSessionToken () {
  return dispatch => {
    dispatch(deleteTokenRequest())
    return appAuthToken.deleteSessionToken()
      .then(() => {
        dispatch(deleteTokenRequestSuccess())
      })
  }
}
/**
 * ## Token
 * If AppAuthToken has the sessionToken, the user is logged in
 * so set the state to logout.
 * Otherwise, the user will default to the login in screen.
 */
export function getSessionToken () {
  return dispatch => {
    dispatch(sessionTokenRequest())
    return appAuthToken.getSessionToken()

      .then((token) => {
        if (token) {
          dispatch(sessionTokenRequestSuccess(token))
          dispatch(logoutState())
          Actions.Tabbar()
        } else {
          dispatch(sessionTokenRequestFailure())
          Actions.InitialLoginForm()
        }
      })

      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error))
        dispatch(loginState())
        Actions.InitialLoginForm()
      })
  }
}

/**
 * ## saveSessionToken
 * @param {Object} response - to return to keep the promise chain
 * @param {Object} json - object with sessionToken
 */
export function saveSessionToken (json) {
  return appAuthToken.storeSessionToken(json)
}
/**
 * ## signup
 * @param {string} username - name of user
 * @param {string} email - user's email
 * @param {string} password - user's password
 *
 * Call the server signup and if good, save the sessionToken,
 * set the state to logout and signal success
 *
 * Otherwise, dispatch the error so the user can see
 */
export function signup (username, email, password) {
  return dispatch => {
    dispatch(signupRequest())
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((json) => {
        console.log(json,'JA JAY SON');
          let m  = firebase.auth().currentUser;
      firebase.database().ref(`/users/${m.uid}/people`)
        .push({email:email, password:password})
          .then(function() {
            saveSessionToken(
              Object.assign({}, json,
                { username: username,
                  email: email
                })
              )
              .then(() => {
                dispatch(signupSuccess(
                  Object.assign({}, json,
                   { username: username,
                     email: email
                   })
                ))
                dispatch(logoutState())
                // navigate to Tabbar
                Actions.Tabbar()
              })
          })
        })
      .catch((error) => {
        dispatch(signupFailure(error))
      })
  }
}

/**
 * ## Login actions
 */
export function loginRequest () {
  return {
    type: LOGIN_REQUEST
  }
}

export function loginSuccess (json) {
  return {
    type: LOGIN_SUCCESS,
    payload: json
  }
}

export function loginFailure (error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  }
}
/**
 * ## Login
 * @param {string} email - user's email
 * @param {string} password - user's password
 *
 * After calling Backend, if response is good, save the json
 * which is the currentUser which contains the sessionToken
 *
 * If successful, set the state to logout
 * otherwise, dispatch a failure
 */

export function login (email, password) {
 return (dispatch) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(obj) {
      // const { name, avatar } = {
        //`/users/${m.uid}/people
       let m  = firebase.auth().currentUser;
      firebase.database().ref(`/users/${m.uid}/people/${DeviceInfo.getUniqueID()}`)
        .set({ email: email,
               avatar:'avatar'
             });
      // };
      dispatch(startChatting(dispatch,obj));


    })
    .catch((error) => {
      dispatch(loginFailure(error))
    });
  }
}
export const userAuthorized = () => ({
    type: 'USER_AUTHORIZED'
});
export const receiveMessages = (messages) => {
  console.log(messages,'recieve messages');
    return function (dispatch) {
        Object.values(messages).forEach(msg => dispatch(addMessage(msg)));

        dispatch(receivedMessages());
    }
};
export const addMessage = (msg) => ({
    type: 'ADD_MESSAGE',
    ...msg
});
export const fetchMessages = () => {
  console.log('snapshot snapshot ')
    return function (dispatch) {
        dispatch(startFetchingMessages());

        firebase.database()
                .ref('messages')
                .orderByKey()
                .limitToLast(20)
                .on('value', (snapshot) => {
                  console.log(snapshot.val(),'snapshot snapshot ')
                    // gets around Redux panicking about actions in reducers
                    setTimeout(() => {
                        const messages = snapshot.val() || [];

                        dispatch(receiveMessages(messages))
                    }, 0);
                });
    }
};
export const startFetchingMessages = () => ({
    type: 'START_FETCHING_MESSAGES'
});
export function startChatting (dispatch, obj) {
    console.log('AJAJJAAJAJAJAJAJAJAJAJAJAJAJAJAJ')
    //dispatch(userAuthorized());
    dispatch(fetchMessages());

    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
           console.log(token, 'JaJA die token')
       });
    FCM.subscribeToTopic('secret-chatroom');
    //FCM.subscribeToTopic('intellicell-chatroom');

    FCM.on(FCMEvent.Notification, async (notif) => {
        console.log(notif, 'amI notifidedddd');

        if (Platform.OS === 'ios') {
            switch (notif._notificationType) {
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
                    break;
              }
        }
    });

    FCM.on(FCMEvent.RefreshToken, token => {
        console.log(token);
    });
          dispatch(loginSuccess(obj.toJSON()))
          // navigate to Tabbar


                Actions.Tabbar()

          dispatch(logoutState())
}
/**
 * ## ResetPassword actions
 */
export function resetPasswordRequest () {
  return {
    type: RESET_PASSWORD_REQUEST
  }
}

export function resetPasswordSuccess () {
  return {
    type: RESET_PASSWORD_SUCCESS
  }
}

export function resetPasswordFailure (error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: error
  }
}
/**
 * ## ResetPassword
 *
 * @param {string} email - the email address to reset password
 * *Note* There's no feedback to the user whether the email
 * address is valid or not.
 *
 * This functionality depends on the server set
 * up correctly ie, that emails are verified.
 * With that enabled, an email can be sent w/ a
 * form for setting the new password.
 */
export function resetPassword (email) {
  return dispatch => {
    dispatch(resetPasswordRequest())
    return firebase.auth().resetPassword({
      email: email
    })
      .then(() => {
        dispatch(loginState())
        dispatch(resetPasswordSuccess())
        Actions.Login()
      })
      .catch((error) => {
        dispatch(resetPasswordFailure(error))
      })
  }
}
