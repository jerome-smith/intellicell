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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 2,
  },
  feedback: {
    textAlign: 'center',
    color: '#996633',
    marginBottom: 3,
  },
  button: {
    backgroundColor: "teal",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    borderRadius: 10
  },
  buttonText: {
    color: "white",
    backgroundColor: "transparent"
  },
});
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
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      tokenCopyFeedback: ""
    }
  }

  componentDidMount(){
    FCM.getInitialNotification().then(notif => {
      this.setState({
        initNotif: notif
      })
    });
  }

  showLocalNotification() {
    FCM.presentLocalNotification({
      vibrate: 500,
      title: 'Hello',
      body: 'Test Notification',
      priority: "high",
      show_in_foreground: true,
      picture: 'https://firebase.google.com/_static/af7ae4b3fc/images/firebase/lockup.png'
    });
  }

  scheduleLocalNotification() {
    FCM.scheduleLocalNotification({
      id: 'testnotif',
      fire_date: new Date().getTime()+5000,
      vibrate: 500,
      title: 'Hello',
      body: 'Test Scheduled Notification',
      priority: "high",
      show_in_foreground: true,
      picture: 'https://firebase.google.com/_static/af7ae4b3fc/images/firebase/lockup.png'
    });
  }

  render() {
    let { token, tokenCopyFeedback } = this.state;

    return (
      <View style={styles.container}>
        <PushController
          onChangeToken={token => this.setState({token: token || ""})}
        />
        <Text style={styles.welcome}>
          Welcome to Simple Fcm Client!
        </Text>

        <Text>
          Init notif: {JSON.stringify(this.state.initNotif)}

        </Text>

        <Text selectable={true} onPress={() => this.setClipboardContent(this.state.token)} style={styles.instructions}>
          Token: {this.state.token}
        </Text>

        <Text style={styles.feedback}>
          {this.state.tokenCopyFeedback}
        </Text>

        <TouchableOpacity onPress={() => firebaseClient.sendNotification(token)} style={styles.button}>
          <Text style={styles.buttonText}>Send Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => firebaseClient.sendData(token)} style={styles.button}>
          <Text style={styles.buttonText}>Send Data</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => firebaseClient.sendNotificationWithData(token)} style={styles.button}>
          <Text style={styles.buttonText}>Send Notification With Data</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.showLocalNotification()} style={styles.button}>
          <Text style={styles.buttonText}>Send Local Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.scheduleLocalNotification()} style={styles.button}>
          <Text style={styles.buttonText}>Schedule Notification in 5s</Text>
        </TouchableOpacity>
      </View>
    );
  }

  setClipboardContent(text) {
    Clipboard.setString(text);
    this.setState({tokenCopyFeedback: "Token copied to clipboard."});
    setTimeout(() => {this.clearTokenCopyFeedback()}, 2000);
  }

  clearTokenCopyFeedback() {
    this.setState({tokenCopyFeedback: ""});
  }
}

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Subview)
