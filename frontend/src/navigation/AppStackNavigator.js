import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/AdminDashboard';
import StudentDashboard from '../screens/StudentDashboard';
import Login from '../screens/Login';
import React from 'react'

const Stack = createStackNavigator();

const AppStackNavigator  = () => {
    return (
        <Stack.Navigator
            id="App"
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Login"
        >
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="StudentDashboard" component={StudentDashboard}/>
            {/* <Stack.Screen name="AdminDashboardStackNavigator" /> */}
            {/* <Stack.Screen name="StudentDashboardStackNavigator" /> */}
        </Stack.Navigator>
    )
}

export default AppStackNavigator