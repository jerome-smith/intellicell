/**
 * # FormButton.js
 *
 * Display a button that responds to onPress and is colored appropriately
 */
'use strict'
/**
 * ## Imports
 *
 * React
 */
import React, { Component } from 'react'
import
{
  StyleSheet,
  View
} from 'react-native'

/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  },
  button: {
    backgroundColor: '#60849b',
    borderColor: '#2f6384'
  }

})
class FormButton extends Component {
  /**
   * ### render
   *
   * Display the Button
   */
  render () {
    return (
      <View style={styles.signin}>
        <Button style={styles.button}
          textStyle={{fontSize: 18}}
          isDisabled={this.props.isDisabled}
          onPress={this.props.onPress} >
          {this.props.buttonText}
        </Button>
      </View>
    )
  }
}

module.exports = FormButton
