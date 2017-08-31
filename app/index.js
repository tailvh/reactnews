import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native'
import RxTabs from './Components/RxTabs'
import { Router, Scene, ActionConst } from 'react-native-router-flux'

import Animations from './Animations/RxAnimations'
import NewsScreen from './Screens/NewsScreen'
import VideoScreen from './Screens/VideoScreen'
import TrendScreen from './Screens/TrendScreen'
import PersonalScreen from './Screens/PersonalScreen'
import ModalScreen from './Screens/ModalScreen'
import ModalDetailScreen from './Screens/ModalDetailScreen'

class MainScreen extends Component {
  render() {
    return (
      <RxTabs>          
        <View title="news" label="Tin tức" style={styles.content} icon="news">
          <NewsScreen />            
        </View>

        <View title="video" label="Video" style={styles.content} icon="video">
          <VideoScreen />
        </View>
        
        <View title="trend" label="Xu hướng" style={styles.content} icon="trend">
          <TrendScreen />
        </View>

        <View title="personal" label="Cá nhân" style={styles.content} icon="personal">
          <PersonalScreen />
        </View>
      </RxTabs>
    )
  }
}

class AllnewsClient extends Component {  
  render() {    
    return (
      <View style={styles.container}>
        <MyStatusBar backgroundColor="#000000" barStyle="light-content" />
        <Router hideNavBar={true} tabBarStyle={{backgroundColor: 'white', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#cccccc'}} animationStyle={Animations.forVertical}>
          <Scene key="root">
            <Scene key="main" component={MainScreen} initial={true} />
            <Scene key="modal" component={ModalScreen} title="Modal" hideNavBar />
            <Scene key="modal_plus" component={ModalScreen}  title="Thêm bài chủ đề" hideNavBar />
            <Scene key="modal_search" component={ModalScreen}  title="Tìm kiếm" hideNavBar />
            <Scene key="modal_personal" component={ModalScreen}  title="Cá nhân" hideNavBar />
            <Scene key="modal_detail" component={ModalDetailScreen} title="Bài viết" />
          </Scene>
        </Router>
      </View>
    )
  }  
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor:'#000000',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
)

export default AllnewsClient

