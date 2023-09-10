import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppFooter from './src/components/BottomNavigation'
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppFooter />        
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
