/**
 * # Subview.js
 *
 *  This is called from main to demonstrate the back button
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'

/**
 * Navigation Bar
 */
import NavigationBar from 'react-native-navbar'


/**
 * The necessary components from React
 */
import React, { Component } from 'react'
import
{
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard
}
from 'react-native'
import FCM from "react-native-fcm";

import PushController from "./PushController";
import firebaseClient from  "./FirebaseClient";

/**
 * Use device options so we can reference the Version
 *
 */
import * as deviceActions from '../reducers/device/deviceActions'
import * as chatActions from '../reducers/chat/chatActions'

import { Examples } from '@shoutem/ui';

// /Users/jsmith/intellicell/src/components/ChatUI.js
import ChatUI from '../components/ChatUI';
//import LoginUI from './components/LoginUI';

//import { fetchMessages, checkUserExists } from './actions';

/**
* ## Redux boilerplate
*/

/**
 *  Instead of including all app states via ...state
 *  You probably want to explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    deviceVersion: state.device.version
  }
}

/*
 * Bind all the actions in deviceActions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(deviceActions, dispatch)
  }
}


/**
 * ### Translations
 */
//var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
//I18n.translations = Translations

/**
 * ## Subview class
 */
class Subview extends Component {
    render() {
        return (
          <ChatUI/>
        );
    }
}

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Subview)
