import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import abcctx from '../lib/abcContext'

import CachedUsers from './CachedUsers/CachedUsers.ui'
import { setCachedUsers } from './CachedUsers/CachedUsers.action'
import Loader from './Loader/Loader.ui'
import WarningModal from './WarningModal/WarningModal.ui'
import ErrorModal from './ErrorModal/ErrorModal.ui'
import Login from './Login/Login.ui'
import LoginWithPin from './Login/LoginWithPin.ui'

import { openLogin, blurUsername } from './Login/Login.action'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from 'native-base'
import appTheme from '../../Themes/appTheme'
import t from '../lib/LocaleStrings'


class Main extends Component {

  componentWillMount () {
    const dispatch = this.props.dispatch
    abcctx(ctx => {
      const cachedUsers = ctx.listUsernames()
      dispatch(setCachedUsers(cachedUsers))
    })
  }

  handleOpenLogin = () => {
    this.props.dispatch(openLogin())
  }

  render () {
    if (this.props.pin) {
      return (
          <LoginWithPin />
      )
    }

    if (!this.props.pin) {
      if (this.props.password) {
        return (<Login />)
      }

      if (!this.props.password) {
        return (
          <View style={style.main}>
            <TouchableOpacity style={[ style.button, { backgroundColor: '#80C342' }]} onPress={this.handleOpenLogin}>
              <Text style={style.buttonText}>{t('fragment_landing_signin_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ style.button, { backgroundColor: '#2291CF' }]} onPress={Actions.signup}>
              <Text style={style.buttonText}>{t('fragment_landing_signup_button')}</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }
  }

}

class HomeComponent extends Component {

  render () {
    return (
      <Image source={require('../assets/drawable/background.jpg')} resizeMode='cover' style={style.backgroundImage}>
        <View style={style.logoContainer}>
          <Image source={require('../assets/drawable/logo.png')} style={style.logoImage} />
        </View>
        <Main />
        <Loader />
        <WarningModal />
        <ErrorModal />
      </Image>
    )
  }

}

const style = StyleSheet.create({

  main: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1
  },
  horizontalSpacer: {
    flex: 0.25
  },

  welcome: {
    fontSize: 30,
    textAlign: 'left',
    margin: 10,
    color: '#FFFFFF'
  },

  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoContainer: {
     flex: 0.2,
     flexDirection: 'column'
  },
  logoImage: {
    flex: 1,
    resizeMode: 'contain'
  },
 

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.7,
    height: 45,
    marginVertical: 3
  }

})

export default connect(state => ({

  password: state.login.viewPassword,
  selectedUserToLogin: state.cachedUsers.selectedUserToLogin,
  pin: state.login.viewPIN

}))(HomeComponent)
