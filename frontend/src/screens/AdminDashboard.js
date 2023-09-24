import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView, BackHandler } from 'react-native'
import AppHeader from '../components/AppHeader'
import storage from '../storage'
import AppContainer from '../components/AppContainer'

const AdminDashboard = ({ navigation }) => {
    React.useEffect(() => {
        const handleBackButton = () => true;
        BackHandler.addEventListener("hardwareBackPress", handleBackButton);
        return () => {
            BackHandler.removeEventListener(
                "hardwareBackPress",
                handleBackButton
            )
        }
    }, [])


    const {
        wrapper,
        container,
    } = styles

    const HeaderProps = {
        HeaderTitle: 'Admin Dashboard',
        isNestedPage: false
    }

    const NavigationProps = {
        backRoute: '',
        navigation: navigation
    }


    return (
        <AppContainer HeaderProps={HeaderProps} NavigationProps={NavigationProps}
            AppContent={() => <Text>Admin</Text>}
        />
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 10
    }
})
export default AdminDashboard