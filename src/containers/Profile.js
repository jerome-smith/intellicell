/**
 * # Profile.js
 *
 * This component provides an interface for a logged in user to change
 * their username and email.
 * It too is a container so there is boilerplate from Redux similar to
 * ```App``` and ```Login```
 */
'use strict'
/**
* ## Imports
*
* Redux
*/
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as profileActions from '../reducers/profile/profileActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * The ErrorAlert will display any and all errors
 */
import ErrorAlert from '../components/ErrorAlert'
/**
 * The FormButton will respond to the press
 */
import FormButton from '../components/FormButton'
/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header'

/**
 * The itemCheckbox will display the state of the email verified
 */
// import ItemCheckbox from '../components/ItemCheckbox'
/**
 * The necessary React components
 */
import React, {Component} from 'react'
import
{
  StyleSheet,
  View
}
from 'react-native'

/**
* The form processing component
*/
import t from 'tcomb-form-native'

let Form = t.form.Form

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  }
})

/**
* ## Redux boilerplate
*/

function mapStateToProps (state) {
  return {
    profile: state.profile,
    global: {
      currentUser: state.global.currentUser,
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...profileActions, ...globalActions }, dispatch)
  }
}
/**
 * ### Translations
 */
// var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
// I18n.translations = Translations

class Profile extends Component {
  /**
   * ## Profile class
   * Set the initial state and prepare the errorAlert
   */
  constructor (props) {
    super(props)
    this.errorAlert = new ErrorAlert()
    this.state = {
      formValues: {
        firstname: '',
        email: ''
      }
    }
  }
  /**
   * ### onChange
   *
   * When any fields change in the form, fire this action so they can
   * be validated.
   *
   */
  onChange (value) {
    if (value.firstname !== '') {
      this.props.actions.onProfileFormFieldChange('firstname', value.firstname)
    }
    if (value.email !== '') {
      this.props.actions.onProfileFormFieldChange('email', value.email)
    }
    this.setState({value})
  }
  /**
   * ### componentWillReceiveProps
   *
   * Since the Forms are looking at the state for the values of the
   * fields, when we we need to set them
   */
  componentWillReceiveProps (props) {
    this.setState({
      formValues: {
        firstname: this.props.global.currentUser.firstname,
        email: this.props.global.currentUser.email
      }
    })
  }
  /**
   * ### componentDidMount
   *
   * During Hot Loading, when the component mounts due the state
   * immediately being in a "logged in" state, we need to just set the
   * form fields.  Otherwise, we need to go fetch the fields
   */
  componentDidMount () {
    console.log('I am mounting component',this.props.global.currentUser)
    if (this.props.global.currentUser.uid) {
      this.props.actions.getProfile(this.props.global.currentUser)
    } else {
      console.log('alert me when this is called', this.props.profile)
      // get a ref then set it
      this.setState({
        formValues: {
          firstname: this.props.global.currentUser.firstname,
          email: this.props.global.currentUser.email
        }
      })
      console.log(this.state.formValues,'this is the formValues')
    }
  }

  /**
   * ### render
   * display the form wrapped with the header and button
   */
  render () {
    this.errorAlert.checkError(this.props.profile.form.error)

    let self = this

    let ProfileForm = t.struct({
      firstname: t.String,
      email: t.String
    })
    /**
     * Set up the field definitions.  If we're fetching, the fields
     * are disabled.
     */
    let options = {
      auto: 'placeholders',
      fields: {
        firstname: {
          label: 'Firstname',//I18n.t('Profile.username'),
          editable: !this.props.profile.form.isFetching,
        },
        email: {
          label: 'email',//I18n.t('Profile.email'),
          keyboardType: 'email-address',
          editable: !this.props.profile.form.isFetching,
          hasError: this.props.profile.form.fields.emailHasError,
          error: this.props.profile.form.fields.emailErrorMsg
        }
      }
    }

    /**
     * When the button is pressed, send the users info including the
     * ```currrentUser``` object as it contains the sessionToken and
     * user objectId
     */
    let profileButtonText = 'Profile update'//JSON.parse(Translations).en.Profile.update//I18n.t('Profile.update')
    let onButtonPress = () => {
      this.props.actions.updateProfile(
        this.props.profile.form.originalProfile.objectId,
        this.props.profile.form.fields.firstname,
        this.props.profile.form.fields.email,
        this.props.global.currentUser)
    }
    /**
     * Wrap the form with the header and button.  The header props are
     * mostly for support of Hot reloading. See the docs for Header
     * for more info.
     */
    let verfiedText = 'Verified display'
    // I18n.t('Profile.verified') +
    //                    ' (' +
    //                    I18n.t('Profile.display') +
    //                    ')'
    console.log(this.state, this.props);
    return (
      <View style={styles.container}>
        <Header isFetching={this.props.profile.form.isFetching}
          showState={this.props.global.showState}
          currentState={this.props.global.currentState}
          onGetState={this.props.actions.getState}
          onSetState={this.props.actions.setState}
        />
        <View style={styles.inputs}>
          <Form
            ref='form'
            type={ProfileForm}
            options={options}
            value={this.state.formValues}
            onChange={this.onChange.bind(self)}
          />

        </View>

        <FormButton
          isDisabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
          onPress={onButtonPress.bind(self)}
          buttonText={profileButtonText} />

      </View>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
