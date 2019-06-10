
import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Button} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import {API_HOST} from '../services/constant'

const {width,height}= Dimensions.get('window')

export default class Transactions extends Component {

state = {
    isRefreshing:true,
    transactions: [],
    errors:'',
    orderByStatus:false,
}

static navigationOptions = {

      headerTitle: 'Recent Transactions',

}

componentWillMount() {

     this.getTransactions()

}

// This for loop is for getting all data(pagination) from API with more than one request.
// if we can get ordered(by statu-by recent) data from api, we can get data with pagination and according to scrolling end of page.

getTransactions = () => {
      for(page=0;page<50;page++){
          if(this.state.isRefreshing)
              {
                this.getTransactionPage(page)
              }
      }
}

getTransactionPage = async(page) => {

          try {
               let transactions = await fetch( `${API_HOST}transactions/${page}`, { method: "GET"}  )
               let transactionsJson = await transactions.json()
               if(transactionsJson.length>0){
                   this.setState({transactions:[...this.state.transactions,...transactionsJson]})  // data collecting to array on state
              } else {
                   this.setState({isRefreshing:false})
              }

          }
          catch (errors) {
             this.setState({isRefreshing:false,errors:errors})
          }
}

// format date what you want with moment
renderItem = ({item}) => (

    <View style={styles.container}>
      <TouchableOpacity  style={styles.touchCont} onPress={() =>{
        this.props.navigation.navigate('TransactionDetail', {transaction:item}) }} >
        <View style={styles.rowCont}>
          <Text style={styles.textBold}>id: {item.id}</Text>
          <Text style={styles.textBold}>{item.status}</Text>
        </View>
        <View style={styles.rowCont}>
          <Text style={styles.text}>{moment(item.fromDate).format('MMMM Do YYYY')}</Text>
          <Text style={styles.text}>{item.price} {item.currency}</Text>
        </View>
      </TouchableOpacity>
    </View>
)


  _keyExtractor = (item, index) => item.id.toString()     // for unique key

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity   onPress={() =>{this.setState({orderByStatus:!this.state.orderByStatus})}} >
            <View style={styles.orderByView}>
             <Text style={styles.orderByText}>Order By {!this.state.orderByStatus? 'Status' : 'Recent'}</Text>
            </View>
          </TouchableOpacity>
          <FlatList
            style={styles.flatList}
            data={this.state.orderByStatus ? _.orderBy(this.state.transactions, 'status', 'asc')      // order data by status and by recent for transactions with lodash
                                           : _.orderBy(this.state.transactions, 'fromDate', 'desc') }
            onRefresh={() =>{  this.getTransactions() }}
            refreshing={this.state.isRefreshing}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rowCont: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width:width-20
  },
  flatList: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    width:width
  },
  orderByView: {
    padding:10,
    margin:10,
    borderRadius:8,
    backgroundColor:'darkgrey',
    alignItems:'center',
    justifyContent:'center'
  },
  orderByText: {
    color:'white'
  },
  text: {
    color:'black'
  },
  textBold: {
    color:'black',
    fontWeight:'bold'
  },
  touchCont: {
    margin:8
  },
  error: {
    color:'red'
  }

});
