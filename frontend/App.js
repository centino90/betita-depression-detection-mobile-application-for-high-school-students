import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
// import AppFooter from './src/components/BottomNavigation'
import {View, Text} from 'react-native'
import { PaperProvider, BottomNavigation} from 'react-native-paper'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  QueryClient,
  QueryClientProvider
} from 'react-query'
import { createStackNavigator } from '@react-navigation/stack';
import Questionnaire from './src/screens/Questionnaire';
import Account from './src/screens/Account';
import ChangePassword from './src/screens/ChangePassword';
import Questionnaires from './src/screens/Questionnaires'
import Login from './src/screens/Login';

// const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          {/* <Stack.Navigator initialRouteName='login' screenOptions={{headerShown: false}}>                    
              <Stack.Screen component={AppFooter} name='authorized' />
              <Stack.Screen component={Login} name='login'/>              
          </Stack.Navigator> */}
          <AppFooter />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  )
}

const QuestionnaireStack = () => {
  return (
    <Stack.Navigator initialRouteName='questionnaires' screenOptions={{headerShown: false}}>
        <Stack.Screen name="questionnaires" component={Questionnaires} />
        <Stack.Screen name="questionDetail" component={Questionnaire} />        
    </Stack.Navigator>
  );
}

// function AccountStack() {
//   return (
//     <Stack.Navigator initialRouteName='account'>            
//       <Stack.Screen name="changePassword" component={ChangePassword} /> 
//       <Stack.Screen name="account" component={Account} />
//     </Stack.Navigator>
//   );
// }

// function HomeStack() {
//   return (    
//     <View name="home" component={QuestionnaireStack} />    
//   )
// }

const HomeStack2 = () =>  <Account />

const AppFooter = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([      
      { key: 'questionnaires', title: 'Questionnaires', focusedIcon: 'archive-edit', unfocusedIcon: 'archive-edit-outline'},      
      { key: 'account', title: 'Account', focusedIcon: 'account-cog', unfocusedIcon: 'account-cog-outline' } 
    ]);

    const renderScene = BottomNavigation.SceneMap({        
        questionnaires: QuestionnaireStack,
        account: HomeStack2

    });    

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    )
}

export default App
