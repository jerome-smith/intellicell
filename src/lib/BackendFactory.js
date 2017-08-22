/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

// import CONFIG from './config'
import { firebaseServer } from './FirebaseServer'
// if i had to use an express server to connet to firebase
// this would be plugged in here
export default function BackendFactory (token = null) {
console.log(firebaseServer, 'firebase firebase firebase')
    return firebaseServer
}
