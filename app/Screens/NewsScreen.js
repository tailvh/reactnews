import React, { Component } from 'react'
import { StyleSheet, Text, View, StatusBar, AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/SimpleLineIcons'

import RxFadeinView from './../Animations/RxFadeinView'
import RxModel from './../Models/RxModel'
import RxMenuList from './../Components/RxMenuList'
import RxPostList from './../Components/RxPostList'

function removeDuplicatesBy(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}


class Screen extends Component {
  isLoading: any
  curPage: any

  componentDidMount() { 
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  // Click on menu 
  handleMenuList(curItem, isScrollTop, isLoadNew) {
    isScrollTop = (typeof(isScrollTop) != 'undefined')? isScrollTop : true    
    isLoadNew   = (typeof(isLoadNew) != 'undefined')? isLoadNew : true 

    // Set view state first 
    this.setState({ curMenu: curItem.id })

    // When click on menu, set state and scroll to top
    if (isLoadNew) {
      this.curPage = 1
      this.state.catPosts[curItem.id] = []
    }
    
    if (isScrollTop) {
      this.childPostList.scrollTop()
    }

    this.helpGetdataStored(curItem)
  }

  // Help get data from local storage
  helpGetdataStored(curItem, recursive) {        
    
    // Do we need recursive ?
    recursive = (typeof(recursive) == 'undefined')? true : recursive

    AsyncStorage.getItem('postlist'+curItem.id).then((data)=> {

      // If null data load new data for all app
      if (!data) {        
        if (recursive) {
          this.fetchData(null, (jsondata)=> {                      
            AsyncStorage.setItem('postlist'+curItem.id, JSON.stringify(jsondata.data)).then(()=> {
              this.helpGetdataStored(curItem, false)
            })
          })
        }             
      }      
      
      var curMenuObj = curItem
      this.state.catPosts[curItem.id] = JSON.parse(data)

      if (this._mounted) {
        this.setState({ curMenu: curMenuObj.id, catPosts: this.state.catPosts, listPosts: this.state.catPosts[curItem.id], curPage: 1 })
      }      
    })
  }

  // Loadmore post
  handlePostListLoadMore() {    
    if (!this.isLoading) {
      this.isLoading = true
      this.curPage += 1

      this.fetchData({page_number: this.curPage}, (jsondata)=> {

        // Append more data to post list
        var tempCatPosts = this.state.catPosts
        var curMenuObj = this.state.listMenus.filter(obj=> {return obj.id == this.state.curMenu})[0] || 0

        // Append to the end of list
        this.isLoading = false
        tempCatPosts[curMenuObj.id] = removeDuplicatesBy(x => x.contentId, tempCatPosts[curMenuObj.id].concat(jsondata.data))        
        if (this._mounted) {
          this.setState({ catPosts: tempCatPosts })        
          this.setState({ curMenu: curMenuObj.id, listPosts: this.state.catPosts[curMenuObj.id], curPage: 1 })
        }        
      })
    }    
  }

  handleShowPostDetail(item) {    
    Actions.modal_detail(item)
  }

  // Refreshing post
  handlePostListRefresh(callback) {
    if (!this.isLoading) {
      this.isLoading = true
      this.fetchData({page_number: 1}, (jsondata)=> {
        // Prepend more data to post list
        var tempCatPosts = this.state.catPosts
        var curMenuObj = this.state.listMenus.filter(obj=> {return obj.id == this.state.curMenu})[0] || 0

        // Remove dupplicate element
        for (var i=0; i< jsondata.data.length; i++) {
          if (tempCatPosts[curMenuObj.id].indexOf(jsondata.data[i]) != -1) {
            jsondata.data.splice(i, 1) 
          }
        }

        // Prepent to begin
        this.isLoading = false
        tempCatPosts[curMenuObj.id] = removeDuplicatesBy(x => x.contentId, jsondata.data.concat(tempCatPosts[curMenuObj.id]))
        if (this._mounted) {
          this.setState({ catPosts: tempCatPosts })        
          this.setState({ curMenu: curMenuObj.id, listPosts: this.state.catPosts[curMenuObj.id], curPage: 1 })          
        }        

        // Store to cache data        
        AsyncStorage.setItem('postlist'+curMenuObj.id, JSON.stringify(tempCatPosts[curMenuObj.id].slice(0, 10)))

        if (typeof(callback) == 'function') { callback() }
      })
    }
  }

  // Fetch data
  fetchData(pagination, callback) {    
    pagination = pagination || {page_number: 1}

    // Add category search detail
    var curMenuObj = this.getMenuObj(this.state.curMenu)
    if (curMenuObj['params']) {
      for (var attrname in curMenuObj['params']) { pagination[attrname] = curMenuObj['params'][attrname] }
    }    

    var queryStr = ''
    for (var index in pagination) {
      queryStr += index + '=' + pagination[index] + '&'
    }

    console.log('http://newsapi.ecdc.vn/phone/getposts?' + queryStr)

    try {
      fetch('http://newsapi.ecdc.vn/phone/getposts?' + queryStr)
      .then(response=> response.json())
      .then(jsondata=> {        
        // Fetch with no callback
        if (typeof(callback) != 'function') {
          let tempCatPosts = []
          for (let index in this.state.listMenus) {
            tempCatPosts[this.state.listMenus[index].id] = jsondata.data
          }

          this.setState({ catPosts: tempCatPosts })
        } 
        // Fetch with callback
        else {          
          callback(jsondata)
        }
      })
    } catch(error) {console.error(error)}
  }

  constructor() {
    super()    

    this.curPage = 1
    this.isLoading = false

    let curMenu = 1
    let curPost = 1
    let listMenus = [
      {'name': 'Tin nóng', 'id': 1,   'default': 1, 'params': {search_ishot: '1'}},
      {'name': 'Tin mới', 'id': 2,    'params': {}},
      {'name': 'Bóng đá', 'id': 3,    'params': {search_categoryId: 'c_87'}},
      {'name': 'Độc lạ', 'id': 4,     'params': {search_categoryId: 'c_52'}},
      {'name': 'Tình yêu', 'id': 5,   'params': {search_categoryId: 'c_139'}},
      {'name': 'Giải trí', 'id': 6,   'params': {search_categoryId: 'c_52'}},
      {'name': 'Thế giới', 'id': 7,   'params': {search_categoryId: 'c_119'}},
      {'name': 'Pháp luật', 'id': 8,  'params': {search_categoryId: 'c_58'}},
      {'name': 'Xe 360', 'id': 9,     'params': {search_categoryId: 'c_145'}},
      {'name': 'Công nghệ', 'id': 10, 'params': {search_categoryId: 'c_53'}},
      {'name': 'Ẩm thực', 'id': 11,   'params': {search_categoryId: 'c_84'}},
      {'name': 'Làm đẹp', 'id': 12,   'params': {search_categoryId: 'c_82'}},
      {'name': 'Sức khoẻ', 'id': 13,  'params': {search_categoryId: 'c_82'}},
      {'name': 'Du lịch', 'id': 14,   'params': {search_categoryId: 'c_138'}},
      {'name': 'Nhà đất', 'id': 15,   'params': {search_categoryId: 'c_147'}},
    ]

    let catPosts = []
    for (let index in listMenus) { catPosts[listMenus[index].id] = [] }
    this.state = {
      curMenu: listMenus[0].id,
      curPost: curPost,
      listMenus: listMenus,
      listPosts: catPosts[curMenu],
      catPosts: catPosts,
    }

    this.helpGetdataStored(listMenus[0])
  }

  getMenuObj(curMenuId) {
    for (var i in this.state.listMenus) {
      if (curMenuId == this.state.listMenus[i].id) {
        return this.state.listMenus[i]
      }
    }

    return this.state.listMenus[0] || {}
  }

  render() {    
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>          
          <RxMenuList listItems={this.state.listMenus} curItem={this.state.curMenu}  doUpdate={this.handleMenuList.bind(this)} />
          <Icon name='magnifier' onPress={() => Actions.modal_search()} style={styles.search} />
          <Icon name='plus' onPress={() => Actions.modal_plus()}  style={styles.plusnews} />
        </View>
        <View style={{flex: 1}}>
          <RxPostList 
            showPostDetail={this.handleShowPostDetail.bind(this)}
            loadMore={this.handlePostListLoadMore.bind(this)} 
            reFresh ={this.handlePostListRefresh.bind(this)}
            ref={instance=> {this.childPostList = instance}} 
            listItems={this.state.listPosts} curItem={this.state.curPost} />
        </View>
      </View>
    )
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
  },
  menuContainer: {    
    height: 50,
  },
  postContainer: {
    flex: 1,        
  },
  search: {
    width: 50, 
    height: 50, 
    backgroundColor: '#1d2531', 
    color: '#fff', 
    fontSize: 16, 
    left: 0, top:0, padding:17, 
    position: 'absolute'
  },
  plusnews: {
    width: 50, 
    height: 50, 
    backgroundColor: '#1d2531', 
    color: '#fff', 
    fontSize: 16, 
    right: 0, top:0, padding:17, 
    position: 'absolute'
  }
})

export default Screen
