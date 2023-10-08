import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView, BackHandler } from 'react-native'
import AppHeader from '../components/AppHeader'
import storage from '../storage'
import AppContainer from '../components/AppContainer'
import AdminDepressedStudentsPage from '../components/AdminDepressedStudentsPage'

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

    const HeaderProps = {
        HeaderTitle: 'Admin Dashboard',
        isNestedPage: false
    }

    const NavigationProps = {
        backRoute: '',
        navigation: navigation
    }

    const ContentProps = {
        questionnaire: {}
    }

    const MessageProps = {
        message: 'Answers are successfully saved',
        // visibleActionMessage,
        // memoizedHandleVisibleActionMessage
    }

    return (
        <AppContainer 
            HeaderProps={HeaderProps} 
            NavigationProps={NavigationProps} 
            ContentProps={ContentProps} 
            MessageProps={MessageProps}
            AppContent={() => <AdminDepressedStudentsPage /> }
        />
    )
}

export default AdminDashboard