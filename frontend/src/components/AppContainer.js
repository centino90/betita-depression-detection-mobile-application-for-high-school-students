import * as React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, Menu } from 'react-native-paper'
import AppMenu from './AppMenu'
import AppHeader from './AppHeader'
import AppActionMessage from './AppActionMessage'

const AppContainer = ({ HeaderProps, NavigationProps, AppContent, MessageProps}) => {
    const [isMenuVisible, setMenuVisiblity] = React.useState(true)

    const handleMore = () => setMenuVisiblity(true)

    const { HeaderTitle, isNestedPage} = HeaderProps
    const { navigation, backRoute} = NavigationProps
    const { message, visibleActionMessage, memoizedHandleVisibleActionMessage } = MessageProps

    return (
        <SafeAreaView style={[
            styles.wrapper,
            { backgroundColor: '#F5F5F5' }
        ]}>
            <AppHeader title={HeaderTitle} navigation={navigation} backRoute={backRoute} isNestedPage={isNestedPage} handleMore={handleMore}/>
            <View style={{position: 'relative'}}>
                <AppMenu isMenuVisible={isMenuVisible} setMenuVisiblity={setMenuVisiblity} navigation={navigation}/>
            </View>
            <ScrollView>
                <View style={[styles.container]}>
                    <AppContent />
                </View>
            </ScrollView>
            <AppActionMessage message={message} visibleActionMessage={visibleActionMessage} memoizedHandleVisibleActionMessage={memoizedHandleVisibleActionMessage}/>
            {/* <AppFooter /> */}            
        </SafeAreaView>
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

export default AppContainer