import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import AppHeader from '../components/AppHeader'
import { MD3Colors } from 'react-native-paper'
import moment from 'moment'
import QuestionnaireDetailList from '../components/QuestionnaireDetailList'
import _TextInput from '../components/TextInput'

const ChangePassword = ({navigation}) => {  

  const {
    wrapper,
    container,
  } = styles

  return (   
    <SafeAreaView
    style={[
      wrapper,
      { backgroundColor: '#F5F5F5' }
    ]}
    >
      <AppHeader title='Change Password'>
      </AppHeader>
      <ScrollView>
        <View style={[container]}>
          <_TextInput label='new password' />
          <_TextInput label='confirm new password' />
        </View>
      </ScrollView>
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
export default ChangePassword