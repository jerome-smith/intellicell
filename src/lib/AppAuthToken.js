/**
 * # AppAuthToken.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 * Singleton module see https://k94n.com/es6-modules-single-instance-pattern
 */
'use strict'
/**
 * ## Imports
 *
 * Redux  & the config file
 */
import store from 'react-native-simple-store'


export class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * set the key from the config
   */
  constructor () {
    this.SESSION_TOKEN_KEY = 'SESSION_TOKEN_KEY'
  }

  /**
   * ### storeSessionToken
   * Store the session key
   */
  storeSessionToken (sessionToken) {
    return store.save(this.SESSION_TOKEN_KEY, {
      sessionToken: sessionToken
    })
  }
  /**
   * ### getSessionToken
   * @param {Object} sessionToken the currentUser object
   *
   * When Hot Loading, the sessionToken  will be passed in, and if so,
   * it needs to be stored on the device.  Remember, the store is a
   * promise so, have to be careful.
   */
  getSessionToken (sessionToken) {
    console.log(sessionToken,this.SESSION_TOKEN_KEY)
    if (sessionToken) {
      return store.save(this.SESSION_TOKEN_KEY, {
        sessionToken: sessionToken
      }).then(() => {
        return store.get(this.SESSION_TOKEN_KEY)
      })
    }
    console.log(this.SESSION_TOKEN_KEY)
    return store.get(this.SESSION_TOKEN_KEY)
  }
  /**
   * ### deleteSessionToken
   * Deleted during log out
   */
  deleteSessionToken () {
    return store.delete(this.SESSION_TOKEN_KEY)
  }
}
// The singleton variable
export let appAuthToken = new AppAuthToken()