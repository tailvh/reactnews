import React, { Component } from 'react'
import { StyleSheet, WebView, Text, View, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { Actions } from 'react-native-router-flux'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class ModelDetailScreen extends Component {

  // Pull children out of props passed from App component
  render() {
    var ourApi = 'http://newsapi.ecdc.vn/phone/getpost?link='
    var theApi = 'http://newsapi.ecdc.vn/phone/getpost?link='
    //var theApi = 'http://www.baomoi.com/'
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => Actions.pop()} >
          Đóng
        </Text>
        <WebView source={{uri: this.props.url.replace(theApi, ourApi)}} style={styles.webdetail} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
  },
  webdetail: {
    flex: 1,
    width: width,
    height: height
  }
})