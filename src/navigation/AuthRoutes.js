import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/AuthScreens/Login'
import Signup from '../screens/AuthScreens/Signup'
import ForgotPassword from '../screens/AuthScreens/ForgotPassword'
import OTP from '../screens/AuthScreens/OTP'
import ResetPassword from '../screens/AuthScreens/ResetPassword'

const AuthStack = createNativeStackNavigator()

const AuthRoutes = () => {
  return (
    <AuthStack.Navigator initialRouteName='Login' screenOptions={{headerShown:false}} >
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Signup" component={Signup} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <AuthStack.Screen name="OTP" component={OTP} />
        <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
    </AuthStack.Navigator>
  )
}

export default AuthRoutes

const styles = StyleSheet.create({})