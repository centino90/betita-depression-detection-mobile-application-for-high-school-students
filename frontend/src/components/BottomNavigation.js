/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import Questionnaires from '../screens/Questionnaires'
import { BottomNavigation, Text } from 'react-native-paper';
import Questionnaire from '../screens/Questionnaire';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account';
import ChangePassword from '../screens/ChangePassword';

const Stack = createStackNavigator();

const QuestionRoute = () => {
    return (
        <Stack.Navigator initialRouteName='questionnaires' screenOptions={{headerShown: false}}>
            <Stack.Screen name="questionnaires" component={Questionnaires} />
            <Stack.Screen name="questionDetail" component={Questionnaire} />            
            <Stack.Screen name="changePassword" component={ChangePassword} /> 
        </Stack.Navigator>
    )
}

const AccountRoute = () => <Account />

const AppFooter = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([      
      { key: 'questionnaires', title: 'Questionnaires', focusedIcon: 'archive-edit', unfocusedIcon: 'archive-edit-outline'},      
      { key: 'account', title: 'Account', focusedIcon: 'account-cog', unfocusedIcon: 'account-cog-outline' }      
    ]);

    const renderScene = BottomNavigation.SceneMap({        
        questionnaires: QuestionRoute,
        account: AccountRoute,
    });    

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    )
}

export default AppFooter