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
class PushNotification extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
    });

    // This method get all notification from server side.
    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif)
    });

    // This method give received notifications to mobile to display.
    this.notificationUnsubscribe = FCM.on("notification", notif => {
      console.log("a", notif);
      if (notif && notif.local_notification) {
        return;
      }
      this.sendRemote(notif);
    });

    // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
    this.refreshUnsubscribe = FCM.on("refreshToken", token => {
      console.log("TOKEN (refreshUnsubscribe)", token);
      this.props.onChangeToken(token);
    });
  }
    // This method display the notification on mobile screen.
  sendRemote(notif) {
    console.log('send');
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: "high",
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
  }

  componentWillUnmount() {
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
  }
    render() {
        return null;
    }
}

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(PushNotification)
