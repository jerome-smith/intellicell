/**
 * # ItemCheckbox.js
 *
 * This class was initially written by
 * https://github.com/mhollweck/react-native-item-checkbox
 *
 * I've opened an issue to attempt to merge this back in
 */
'use strict'

/**
 * ## Imports
 *
 * React
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import
{
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native'

 /**
  * The vector icon
  */
import Icon from 'react-native-vector-icons/FontAwesome';

  const propTypes =  {
    onCheck: PropTypes.func,
    onUncheck: PropTypes.func,
    icon_check: PropTypes.string,
    icon_open: PropTypes.string,
    size: PropTypes.number,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    iconSize: PropTypes.string,
    checked: PropTypes.bool,
    style: PropTypes.func,
    text: PropTypes.string,
    disabled: PropTypes.bool
  }
class ItemCheckbox extends Component {
  // static defaultProps =  {
  //     onCheck: null,
  //     onUncheck: null,
  //     icon_check: 'check-square',
  //     icon_open: 'square-o',
  //     size: 30,
  //     backgroundColor: 'white',
  //     color: 'grey',
  //     iconSize: 'normal',
  //     checked: false,
  //     text: 'MISSING TEXT',
  //     disabled: false
  // }
  /**
   * ## ItemCheckbox class
   *
   * set the propTypes
   */
  /**
   * ### getDefaultProps
   * set the default values
   */
  /**
   * ### getInitialState
   *
   * Set the box to be checked or not
   */
  constructor(props) {
    super(props)
    this.setState({
      checked: this.props.checked,
      bg_color: this.props.backgroundColor,
      propTypes

    })
  }
  /**
   * ### _getCircleCheckSytel
   * merge the props styles w/ some defaults
   */
  _getCircleCheckStyle() {
    return {
      width: this.props.size,
      height: this.props.size,
      backgroundColor: this.state.bg_color,
      borderColor: this.props.color,
      borderWidth: 2,
      borderRadius: this.props.size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2
    }
  }
  /**
   * ### _completeProgress
   * If the checkbox is pressable, figure out what state it's in and
   * what the display should look like
   */
  _completeProgress() {
    if (this.state.checked) {
      this.setState({
        checked: false,
        bg_color: this.props.backgroundColor
      })
      if (this.props.onUncheck) {
        this.props.onUncheck()
      }
    } else {
      this.setState({
        checked: true,
        bg_color: this.props.color
      })
      if (this.props.onCheck) {
        this.props.onCheck()
      }
    }
  }
  /**
   * ### componentDidMount
   * If there is a ```checked``` property, set the UI appropriately
   */
  // componentDidMount () {
  //   if (this.props.checked) {
  //     this._completeProgress()
  //   }
  // }
  /**
   * ### render
   * Use Touchable with or without Feedback depending on
   * ```disabled```.
   * Set the ```iconName``` depending on if checked
   */
  render () {
    var iconName = this.state.icon_open
    if (this.state.checked) {
      iconName = this.props.icon_check
    }
    if (this.state.disabled) {
      iconName = this.state.checked ? this.propTypes.icon_check : this.propTypes.icon_open
      return (
        <View style={this.props.style}>
          <TouchableWithoutFeedback>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <Icon
                name={iconName}
                size={20}
              />
              <Text> {this.props.text}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        )
    } else {
      return (
        <View style={this.props.style}>
          <TouchableHighlight
             >
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <Icon
                name={iconName}
                size={20} />
              <Text> {this.props.text}</Text>
            </View>
          </TouchableHighlight>
        </View>
        )
    }
  }
}

module.exports = ItemCheckbox
