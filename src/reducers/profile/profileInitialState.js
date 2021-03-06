/**
 * # profileInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict'

const {Record} = require('immutable')
console.log(this, 'this is is this in the profileInitial state')
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 *
 * The originalProfile is what the server provided and has the objectId
 * The fields are what display on the UI
 */
const Form = Record({
  originalProfile: new (Record({
    username: null,
    firstname:null,
    lastname:null,
    bankname:null,
    accountnumber:null,
    accounttype:null,
    branchcode:null,
    email: null,
    objectId: null,
    emailVerified: null
  }))(),
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: new (Record({
    username: '',
    firstname:'',
    lastname:'',
    bankname:'',
    accountnumber:'',
    accounttype:'',
    branchcode:'',
    usernameHasError: false,
    usernameErrorMsg: '',
    email: '',
    emailHasError: false,
    emailErrorMsg: '',
    emailVerified: false
  }))()
})

var InitialState = Record({
  form: new Form()
})

export default InitialState
