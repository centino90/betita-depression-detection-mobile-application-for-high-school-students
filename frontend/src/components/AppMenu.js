import * as React from 'react'
import { View } from 'react-native'
import { Button, Menu } from 'react-native-paper'
import storage from '../storage'

const AppMenu = ({ isMenuVisible, setMenuVisiblity, navigation }) => {
  const openMenu = () => setMenuVisiblity(true)
  const closeMenu = () => setMenuVisiblity(false)
  
  return (
    <View
      style={{
        paddingTop: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Menu
        visible={isMenuVisible}
        onDismiss={closeMenu}
        anchor={<Button style={{padding: 0, margin: 0, height: 1, maxHeight: 1}}></Button>}>        
        <Menu.Item leadingIcon={'logout'} onPress={() => handleSignOut(navigation)} title="Sign Out" />
      </Menu>
    </View>
  )
}

const handleSignOut = (navigation) => {
  storage.remove({key: 'currentUser', id: 1}).then(res => {    
    navigation.navigate('Login')
  })
  // todo: clear cookie
}

export default AppMenu