import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReactNativeModal from 'react-native-modal'

const KeyboardResponsiveModal = (props) => {
  return (
    <ReactNativeModal
      isVisible={props.isVisible}
      onBackButtonPress={props.onBackButtonPress}
      onBackdropPress={props.onBackdropPress}
      style={styles.center}
    >
        {props.children}
    </ReactNativeModal>
  )
}

export default KeyboardResponsiveModal

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})