import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation'

import Transactions from './screens/transactions'
import TransactionDetail from './screens/transactionDetail'

const App = createStackNavigator({
   Transactions:{screen:Transactions},
   TransactionDetail:{screen:TransactionDetail},
},{mode: 'card'})

 //First Screen is Recent Transactions Page with React Navigation Stack Navigator

export default createAppContainer(App);
