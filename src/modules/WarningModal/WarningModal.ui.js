import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from 'react-native-modalbox'
import { connect } from 'react-redux'
import { closeWarningModal } from '../CachedUsers/CachedUsers.action'

import t from '../../lib/LocaleStrings'

class WarningModal extends Component {

  handleDeleteUsersFromCache = () => {
    console.log('Deleting foo on bar and baz') 
  }
  
  checkHandleSubmit = () => {
    switch (this.props.module) {
      case 'deleteCachedUser' :
        return this.handleDeleteUsersFromCache

      default:
        return null
    }
  }

  handleClose = () => {
    this.props.dispatch(closeWarningModal())
  }

  render () {
    return (
      <Modal
        isOpen={this.props.visible}
        position={'center'}
        style={style.modal}
        animationDuration={200}
        onClosed={this.handleClose}
      >
        <Text style={[ style.textWarning, style.textLead ]}>{ this.props.title }</Text>
        <Text style={style.textWarning}>{  this.props.message }</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.handleClose} >
            <Text style={style.hideModal}>{t('string_cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.checkHandleSubmit()} >
            <Text style={style.hideModal}>{t('string_ok')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const style = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    padding: 20,
    width: 300
  },

  textWarning: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },

  textLead: {
    fontWeight: 'bold',
    color: 'skyblue',
    fontSize: 18
  },

  hideModal: {
    marginTop: 15,
    marginHorizontal: 10,
    fontSize: 18,
    color: 'skyblue',
    textAlign: 'center'
  }
})

export default connect(state => ({

  visible : state.warningModal.visible,
  module  : state.warningModal.module,
  title   : state.warningModal.title,
  message : state.warningModal.message

}))(WarningModal)
