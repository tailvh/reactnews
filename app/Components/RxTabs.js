import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

export default class RxTabs extends Component {
  
  tabTitle = {news: ['Tin tức', 'fire'], video: ['Video', 'control-play'], trend: ['Xu hướng', 'chart'], personal: ['Cá nhân', 'user']}
  state = { activeTab: 0 }

  // Pull children out of props passed from App component
  render({ children } = this.props) {
    return (
      <View style={styles.container}>                
        <View style={styles.contentContainer}>
          <View style={this.state.activeTab === 0 ? styles.contentInner: []}>{children[0]}</View>
          <View style={this.state.activeTab === 1 ? styles.contentInner: []}>{children[1]}</View>
          <View style={this.state.activeTab === 2 ? styles.contentInner: []}>{children[2]}</View>
          <View style={this.state.activeTab === 3 ? styles.contentInner: []}>{children[3]}</View>
        </View>
        <View style={styles.tabsContainer}>          
          {children.map(({ props: { label, title, icon } }, index) =>
            <TouchableOpacity
              style={[ styles.tabContainer, index === this.state.activeTab ? styles.tabContainerActive : [] ]}              
              onPress={() => this.setState({ activeTab: index }) }
              key={index}
            >
              <View>
                <Icon name={this.tabTitle[title][1]} size={15} style={[ styles.tabIcon, index === this.state.activeTab ? styles.tabIconActive : [] ]} />
                <Text style={styles.tabText} style={[ styles.tabText, index === this.state.activeTab ? styles.tabTextActive : [] ]}>{label}</Text>                
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {    
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: 'white', 
    borderTopWidth: StyleSheet.hairlineWidth, 
    borderTopColor: '#cccccc',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 7
  },
  tabContainer: {
    flex: 1,    
  },
  tabContainerActive: {        
  },
  tabIcon: {
    color: '#000000',
    marginBottom: 3, 
    textAlign: 'center' 
  },
  tabIconActive: {
    color: '#FF0000',
  },
  tabText: {
    color: '#000000',    
    textAlign: 'center',
    fontSize: 11
  },
  tabTextActive: {
    color: '#FF0000'    
  },  
  contentContainer: {
    flex: 1
  },
  contentInner: {
    flex: 1,
    backgroundColor: '#33373B'
  }
});