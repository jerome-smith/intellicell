'use strict'
/**
 *  # intellicell
 */

/**
 * ## imports
 *
 */
/**
 * ### React
 *
 * Necessary components from ReactNative
 */
import React, { Component } from 'react'
import FCM from 'react-native-fcm'
import firebase from 'firebase'
//import {I18n} from 'react-native-i18n'
import I18n from 'i18n-js';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text } from 'react-native'

/**
 * ### Router-Flux
 *
 * Necessary components from Router-Flux
 */
import {
    Router,
    Scene} from 'react-native-router-flux'

/**
 * ### Redux
 *
 * ```Provider``` will tie the React-Native to the Redux store
 */
import {
    Provider} from 'react-redux'

/**
 * ### configureStore
 *
 *  ```configureStore``` will connect the ```reducers```, the
 *
 */
import configureStore from './lib/configureStore'

/**
 * ### Translations
 */


// Support fallbacks so en-US & en-BR both use en
I18n.fallbacks = true
// Translations not working as expected yet
import Translations from './lib/Translations'
I18n.translations = Translations

/**
 * ### containers
 *
 * All the top level containers
 *
 */
import App from './containers/App'
import Login from './containers/Login'
import Logout from './containers/Logout'
import Register from './containers/Register'
import ForgotPassword from './containers/ForgotPassword'
import Profile from './containers/Profile'
import Main from './containers/Main'
import Subview from './containers/Subview'
import Chat from './containers/Subview'

/**
 * ### icons
 *
 * Add icon support for use in Tabbar
 *
 */
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * ## Actions
 *  The necessary actions for dispatching our bootstrap values
 */
import {setPlatform, setVersion} from './reducers/device/deviceActions'
import {setStore} from './reducers/global/globalActions'

/**
 * ## States
 * Intellicell explicitly defines initial state
 *
 */
import AuthInitialState from './reducers/auth/authInitialState'
import DeviceInitialState from './reducers/device/deviceInitialState'
import GlobalInitialState from './reducers/global/globalInitialState'
import ProfileInitialState from './reducers/profile/profileInitialState'

/**
 *  The version of the app but not  displayed yet
 */
import pack from '../package'
var VERSION = pack.version

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in intellicell
 * so this is created before we log in
 * @returns {Object} object with 4 keys
 */
function getInitialState (a, b) {
  console.log(a, 'what is this')
  const _initState = {
    auth: new AuthInitialState(a),
    device: (new DeviceInitialState()).set('isMobile', true),
    global: (new GlobalInitialState()),
    profile: new ProfileInitialState(),
  }
  return _initState
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70
  }
})

/**
 * ## TabIcon
 *
 * Displays the icon for the tab w/ color dependent upon selection
 */
class TabIcon extends Component {

  render () {
    var color = this.props.selected ? '#FF3366' : '#FFB3B3'
    return (
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>
        <Icon style={{color: color}} name={this.props.iconName} size={30} />
        <Text style={{color: color}}>{this.props.title}</Text>
      </View>
     )
  }
}

/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */

export default function native (platform) {
  class Intellicell extends Component {
    componentDidMount() {
        firebase.initializeApp({
          apiKey: "AIzaSyCqWCIuaGsAj_uSWWoAkwoVFIsor2g55ec",
          authDomain: "intellicel-c9a74.firebaseapp.com",
          databaseURL: "https://intellicel-c9a74.firebaseio.com",
          projectId: "intellicel-c9a74",
          storageBucket: "intellicel-c9a74.appspot.com",
          messagingSenderId: "1043485647586"
        });
        FCM.requestPermissions();
          FCM.getFCMToken().then(token => {
            console.log(token, 'this is the tokecn');
          // this.setState({fcm_token:token});
          // update your fcm token on server.
        });
         this.loadedFire = firebase;
    }
    render () {
      console.log('this is FCM',FCM);
      const store = configureStore(getInitialState(firebase))

            // configureStore will combine reducers from intellicell and main application
            // it will then create the store based on aggregate state from all reducers
      store.dispatch(setPlatform(platform))
      store.dispatch(setVersion(VERSION))
      store.dispatch(setStore(store))

            // setup the router table with App selected as the initial component
            // note: See https://github.com/aksonov/react-native-router-flux/issues/948
      return (

        <Provider store={store}>
          <Router sceneStyle={{ backgroundColor: 'white' }}>
            <Scene key='root' hideNavBar>
              <Scene key='App'
                component={App}
                type='replace'
                initial />

              <Scene key='InitialLoginForm'
                component={Register}
                type='replace' />

              <Scene key='Login'
                component={Login}
                type='replace' />

              <Scene key='Register'
                component={Register}
                type='replace' />

              <Scene key='ForgotPassword'
                component={ForgotPassword}
                type='replace' />

              <Scene key='Subview'
                component={Subview} />

              <Scene key='Tabbar'
                tabs
                hideNavBar
                tabBarStyle={styles.tabBar}
                default='Main'>

                <Scene key='Logout'
                  title='Logout'//{I18n.t('Intellicell.logout')}
                  icon={TabIcon}
                  iconName={'sign-out'}
                  hideNavBar
                  component={Logout} />

                <Scene key='Main'
                  title= 'Main'//{I18n.t('Intellicell.main')}
                  iconName={'home'}
                  icon={TabIcon}
                  hideNavBar
                  component={Main}
                  initial />

                <Scene key='Profile'
                  title='Profile'//{I18n.t('Intellicell.profile')}
                  icon={TabIcon}
                  iconName={'gear'}
                  hideNavBar
                  component={Profile} />
                <Scene key='Chat'
                  title='Chat'//{I18n.t('Intellicell.profile')}
                  icon={TabIcon}
                  iconName={'chat'}
                  hideNavBar
                  component={Chat} />
              </Scene>
            </Scene>
          </Router>
        </Provider>
      )
    }
  }
    /**
     * registerComponent to the AppRegistery and off we go....
     */

  AppRegistry.registerComponent('intellicell', () => Intellicell)
}
