import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

class RxMenuList extends Component {
   onFilterChange(item) {
      if (typeof this.props.doUpdate === 'function') { this.props.doUpdate(item) }      
   }  
    
   createItem(item, curItem) {            
      return(<Text key={item.id} onPress={() => this.onFilterChange(item)} style={(item.id == curItem)? styles.item_active: styles.item}> {item.name} </Text>)
   }

   render() {      
      return (
         <View style={styles.container}>
            <ScrollView horizontal={true}>               
               {this.props.listItems.map((x)=> { return this.createItem(x, this.props.curItem) } )}
            </ScrollView>
         </View>
      )
   }   
}

const styles = StyleSheet.create ({
   container: {
      paddingLeft: 45,
      paddingRight: 45,
      backgroundColor: '#1d2531',
      flex: 1,
      flexDirection: 'row'
   },
   item: {      
      color: '#ffffff',
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
      marginTop: 12,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      height: 26,
      borderRadius: 12,
      backgroundColor: 'white',
      overflow: 'hidden' 
   }
})

export default RxMenuList