import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import moment from 'moment'
import {API_HOST} from '../services/constant'

const {width,height}= Dimensions.get('window')

export default class TransactionDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'Transaction ID: '+params.transaction.id.toString()
    }
  }

  state = {
    borrower: {},
    lender:{},
    errors:'',
    isRefreshing:true,
    transactionInfo:this.props.navigation.state.params.transaction    // getting transaction infos with react navigation params from first page.

  }

componentWillMount() {
  const {id,lenderId,borrowerId}=this.state.transactionInfo
  this.getBorrower(borrowerId)
  this.getLender(lenderId)
}


getBorrower = async(bid) => {
  try {
       let resBorrower = await fetch( `${API_HOST}user/${bid}`, { method: "GET"}  )
       let borrowerJson = await resBorrower.json()
       this.setState({borrower:borrowerJson,isRefreshing:false})

  }
 catch (errors) {
     this.setState({isRefreshing:false,errors:errors})
  }
}

getLender = async(lid) => {
  try {
       let resLender = await fetch( `${API_HOST}user/${lid}`, { method: "GET"}  )
       let lenderJson = await resLender.json()
       this.setState({lender:lenderJson,isRefreshing:false})

  }
 catch (errors) {
     this.setState({isRefreshing:false,errors:errors})
  }
}

getTransaction = async(id) => {
  this.setState({isRefreshing:true,transactionInfo:{}})
  try {
       let resTransaction = await fetch( `${API_HOST}transaction/${id}`, { method: "GET"}  )
       let transactionJson = await resTransaction.json()
       this.setState({transactionInfo:transactionJson,isRefreshing:false})

  }
 catch (errors) {
     this.setState({isRefreshing:false,errors:errors})
  }
}

approveTransaction = async(id) => {
  this.setState({isRefreshing:true})
  var updateData = { status: "FL_APPROVED"}

  try {
       let resLender = await fetch( `${API_HOST}transaction/${id}`, {
         method: "PUT",
         headers: {
                   "Accept": "application/json",
                   "Content-Type": "application/json"
                   },
         body: JSON.stringify(updateData)}  )

      this.getTransaction(id)

  }
 catch (errors) {
     this.setState({isRefreshing:false,errors:errors})
  }
}

// if transactions is not approved, you can see and use Approve Button.

render() {
  const {id,lenderId,borrowerId,itemId,fromDate,toDate,status,promocode,creditUsed,price,totalDiscount,currency}=this.state.transactionInfo


    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" animating={this.state.isRefreshing} color="#00ff00" />
        <View style={styles.transactionCont}>
            <View style={styles.infoCont}>
                <Text style={styles.transactionInfo}>Item No:{itemId}</Text>
                <Text style={styles.transactionInfo}>{status}</Text>
            </View>
            <Text style={styles.transactionInfo}>{moment(fromDate).format('MMMM Do YYYY')}-{moment(toDate).format('MMMM Do YYYY')}</Text>
            <View style={styles.infoCont}>
                <Text style={styles.transactionInfo}>Promo:{promocode? promocode : '-'}</Text>
                <Text style={styles.transactionInfo}>Total Discount:{totalDiscount} {currency}</Text>
            </View>
            <View style={styles.infoCont}>
                <Text style={styles.transactionInfo}>Credit:{creditUsed} {currency}</Text>
                <Text style={styles.price}>Price:{price} {currency}</Text>
            </View>
        </View>


        <View style={styles.infoUsers}>
            <View style={styles.infoUser}>
                <Text style={styles.header}>Lender</Text>
                <Text style={styles.transactionInfo}>{this.state.lender.firstName} {this.state.lender.lastName}</Text>
                <Text style={styles.transactionInfo}>{this.state.lender.email}</Text>
                <Text style={styles.transactionInfo}>{this.state.lender.telephone}</Text>
                <Text style={styles.transactionInfo}>Credit:{this.state.lender.credit}</Text>
            </View>
            <View style={styles.infoUser}>
                <Text style={styles.header}>Borrower</Text>
                <Text style={styles.transactionInfo}>{this.state.borrower.firstName} {this.state.borrower.lastName}</Text>
                <Text style={styles.transactionInfo}>{this.state.borrower.email}</Text>
                <Text style={styles.transactionInfo}>{this.state.borrower.telephone}</Text>
                <Text style={styles.transactionInfo}>Credit:{this.state.borrower.credit}</Text>
            </View>
        </View>

        { status!=='FL_APPROVED' ?
        <TouchableOpacity  style={styles.touchCont} onPress={() =>{
          this.approveTransaction(id) }} >
          <View style={styles.approveView}>
            <Text style={styles.textBold}>Approve Transaction</Text>
          </View>
        </TouchableOpacity>
        :null }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  transactionInfo: {
    fontSize: 12,
    margin: 10,
  },
  transactionCont: {
    justifyContent: 'center',
    alignItems: 'center',
    width:width-20,
    backgroundColor:'whitesmoke',
    borderRadius:10,

  },
  header: {
    fontSize: 14,
    margin: 10,
    fontWeight:'bold',
    color:'darkgrey'
  },
  price: {
    fontSize: 13,
    margin: 10,
    fontWeight:'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  infoCont: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:width-20
  },
  infoUsers: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:width-20,
    marginTop:15,
  },
  infoUser: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width:width/2-15,
    height:height/3,
    borderRadius:10,
    backgroundColor:'whitesmoke'
  },
  approveView: {
    backgroundColor:'darkgrey',
    padding:10,
    borderRadius:8,
    margin:10,
  }
});
