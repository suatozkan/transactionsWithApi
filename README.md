# Transactions With Api 

![Alt text](https://i.ibb.co/pwhqvyz/transactions.jpg)

Getting recent transactions via api and confirmation of them with React Native.

## Getting Started

* Download Repo.
* 'npm install' in project folder
* react-native run-ios / run-android  
* Set Api url at services/constant.js file.(Example for local host:'http://localhost:8080/')


## Built With

* [react-navigation](https://reactnavigation.org/) - Routing and Navigation
* [Moment](https://momentjs.com/) - Makes some data (arrays, numbers, objects, strings, etc) work easier.
* [Lodash](https://lodash.com/) - Parse and Change Format of Date.


## Design and Structure

* React Navigation is used for page transition and data transferring to other page. it was set in App.js file.
* on Feed Page, we get all transactions by requesting more than one because of we could not order on api level.(getTransactions function) 
* Async Functions are used for getting data with 'fetch' request.
* Datas and status are handled with states.
* Ordering process are done with Lodash(orderBy status/recents)
* Moment was used for formatting of reservation dates.

