import React from 'react'
import { BackHandler, View } from 'react-native'
import AppContainer from '../components/AppContainer'
import _TextInput from '../components/TextInput'

const ChangePassword = ({ navigation }) => {
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
    HeaderTitle: 'Change Password',
    isNestedPage: true
  }

  const NavigationProps = {
    backRoute: 'StudentDashboard',
    navigation: navigation
  }

  const ContentProps = {
    questionnaire: {}
  }

  const MessageProps = {
    message: '',
    // visibleActionMessage,
    // memoizedHandleVisibleActionMessage
  }  


  return (
    <AppContainer HeaderProps={HeaderProps} NavigationProps={NavigationProps} MessageProps={MessageProps}
      AppContent={() => {
        return (
          <View>
            <_TextInput label='new password' />
            <_TextInput label='confirm new password' />
          </View>
        )
      }}
    />
  )
}
export default ChangePassword

// import React from 'react'
// import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
// import AppHeader from '../components/AppHeader'
// import { MD3Colors } from 'react-native-paper'
// import moment from 'moment'
// import QuestionnaireDetailList from '../components/QuestionnaireDetailList'
// import _TextInput from '../components/TextInput'

// const ChangePassword = ({navigation}) => {

//   const {
//     wrapper,
//     container,
//   } = styles

//   return (
//     <SafeAreaView
//     style={[
//       wrapper,
//       { backgroundColor: '#F5F5F5' }
//     ]}
//     >
//       <AppHeader title='Change Password'>
//       </AppHeader>
//       <ScrollView>
//         <View style={[container]}>
//           <_TextInput label='new password' />
//           <_TextInput label='confirm new password' />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1
//   },
//   container: {
//     flex: 1,
//     padding: 10
//   }
// })
// export default ChangePassword