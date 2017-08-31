import React, { Component, WebView } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { Actions } from 'react-native-router-flux'

const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

class RxPostList extends Component {
  maketime(time) {
    time = (time < 0)? 0 : time

    // calculate (and subtract) whole days
    var days = Math.floor(time / 86400);
    time -= days * 86400

    // calculate (and subtract) whole hours
    var hours = Math.floor(time / 3600) % 24;
    time -= hours * 3600

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(time / 60) % 60;
    time -= minutes * 60

    // what's left is seconds
    var seconds = time % 60

    var returnStr = (days) ? ' ' +days+ ' ngày': ''
    returnStr += (hours) ?  ' ' +hours+ ' giờ': ''
    returnStr += (minutes) ?' ' +minutes+ ' phút': ''
    returnStr += (seconds) ?' ' +seconds+ 's': ' 0s'    
    return returnStr
  }

  showPostDetail(item) {
    this.props.showPostDetail(item)
  }

  createItem(item, curItem) {
    let isFirst = this.props.listItems.indexOf(item) == 0
    let tempImg = (typeof(item.avatarUrl) != 'undefined' && item.avatarUrl.length != 0)? item.avatarUrl: uri

    if (isFirst) {
      return(
        <TouchableOpacity onPress={ () => this.showPostDetail(item) }>
        <View key={item.contentId} style={styles.avatarContainerFirst}>
          <Image resizeMode="cover" style={styles.avatarFirst} source={{uri: tempImg}} defaultSource={{uri: uri}}/>
          <View style={styles.postwrapFirst}>
            <View style={styles.labelwrapFirst}>
              <Text style={styles.catFirst}>Tin nóng</Text>
              <Text style={styles.timeFirst}><Icon style={styles.timeicoFirst} name='clock' />{this.maketime(Math.floor(Date.now() / 1000)-item.date)}</Text>
            </View>
            <Text style={styles.nameFirst}>{item.title.substring(0, 70) + ' ...'} </Text>
            <Text style={styles.descFirst}>{item.title.substring(0, 60) + '...'} </Text>
          </View>
        </View>
        </TouchableOpacity>
      )
    } else {
      return(
        <TouchableOpacity onPress={ () => this.showPostDetail(item) }>
        <View key={item.contentId} style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{uri: tempImg}} defaultSource={{uri: uri}}/>
          <View style={styles.postwrap}>
            <Text style={styles.name}>{item.title.substring(0, 80) + ' ...'} </Text>
            <View style={styles.labelwrap}>              
              <Text style={styles.time}><Icon style={styles.timeicoFirst} name='clock' /> {this.maketime(Math.floor(Date.now() / 1000)-item.date)} </Text>
              <Text style={styles.time}><Icon style={styles.timeicoFirst} name='speech' /> {item.totalComments}</Text>
            </View>            
          </View>
        </View>
        </TouchableOpacity>      
      )
    }    
  }

  scrollTop(option) {
    var option = option || {x: 0, y: 0, animated: false}    
    this.refs.listRef.scrollToOffset(option)
  } 

  loadMore() {      
    if (typeof this.props.loadMore === 'function') { this.props.loadMore() }    
  }

  renderFooter() {
    return (      
      <View style={{padding: 20}}>
        <ActivityIndicator animating color="black" />      
        <Text style={{width: 300, height: 100}}></Text>        
      </View>
    )
  }

  onRefreshList() {
    if (typeof this.props.reFresh === 'function') { this.props.reFresh(()=> { this.state.isRefreshing = false }) }    
  }  

  _shouldItemUpdate = (prev, next) => {
    return prev.item !== next.item;
  }

  render() {
    this.state = { isRefreshing: false }

    return (
      <View style={styles.container}>
        <FlatList ref='listRef'
          shouldItemUpdate={this._shouldItemUpdate}          

          numColumns={1}
          refreshing={false}
          initialNumToRender={4}
          style={{paddingBottom: 300}}
          data={this.props.listItems}          
          renderItem={({item}) => { return this.createItem(item, this.props.curItem) } }
          keyExtractor={item => item.contentId}
          ListFooterComponent={this.renderFooter()}

          refreshControl={
           <RefreshControl
               refreshing={this.state.isRefreshing}
               onRefresh={this.onRefreshList.bind(this)}
               title="Pull to refresh"
               tintColor="#fff"
               titleColor="#fff"
            />
          }

          onEndReachedThreshold={5}
          onEndReached={({ distanceFromEnd }) => {this.loadMore()}} />         
      </View>
    )
  }   
}

const styles = StyleSheet.create ({
  container: {    
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row'
  },
  item: {      
    color: 'black',
    fontSize: 13,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 5,
    paddingRight: 5,
    height: 50
  },
  item_active: {
    color: 'black',
    fontSize: 13,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 5,
    paddingRight: 5,
    height: 50
  },
  avatarContainer: {
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,      
    flex: 1,
    flexDirection: 'row'
  },
  avatar: {
    width: 90,
    height: 80,
    borderRadius: 5,
  },
  postwrap: {
    paddingRight: 90,
    paddingLeft: 10,
  },
  name: {
    color: '#111',
    fontSize: 14, 
    fontWeight: '400',
    flex: 1,
    lineHeight: 22
  },
  labelwrap: {
    marginTop: 2,
    flex: 1,
    flexDirection: 'row',
  },
  cat: {        
    overflow: 'hidden',
    color: '#ff4545',
    fontSize: 10,
    fontWeight: '100',
    marginRight: 10
  },
  time: {    
    overflow: 'hidden',
    color: '#888888',
    fontSize: 10,
    fontWeight: '100',
    marginRight: 10
  },
  comment: {
    overflow: 'hidden',
    color: '#888888',
    fontSize: 10,
    fontWeight: '100',
  },
  desc: {
    color: '#888888',
    fontSize: 11,
    flex: 1,
    lineHeight: 18
  },
  avatarContainerFirst: {        
  },
  avatarFirst: {
    width: width,
    height: 240
  },
  postwrapFirst: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',    
    bottom: 0,    
    width: width,
    minHeight: 50,    
    paddingLeft: 10,
    paddingRight: 10
  },
  nameFirst: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 10,  
    fontSize: 16,
    lineHeight: 25
  },
  descFirst: {
    fontSize: 11,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#888888',    
    width: width,
    minHeight: 60,
  },
  labelwrapFirst: {
    position: 'absolute',    
    left: 20,
    bottom: 12,
    flex: 1,
    flexDirection: 'row',
    width: width
  },
  catFirst: {
    paddingTop: 2,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,   
    fontSize: 10,
    borderRadius: 2,
    overflow: 'hidden',
    color: '#ffffff',    
    backgroundColor: '#ff4545',
    marginRight: 10
  },
  timeFirst: {
    position: 'absolute',
    padding: 3,
    paddingLeft: 5,
    paddingRight: 5,   
    borderRadius: 2,
    overflow: 'hidden',
    color: '#eeeeee',
    fontSize: 10,
    fontWeight: '100',
    right: 30
  },
  timeicoFirst: {
    fontSize: 8
  }

})

export default RxPostList