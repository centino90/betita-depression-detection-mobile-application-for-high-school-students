import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import AppHeader from '../components/AppHeader'
import QuestionnaireDetailList from '../components/QuestionnaireDetailList'

const Account = ({navigation}) => {    

  const details = [
    {
      key: 'username',
      icon: 'account-outline',
      value: 'test_123',
      description: 'username',      
    },
    {
      key: 'password',
      icon: 'lock',
      value: '*********',
      description: 'password',
      editLabel: 'edit'
    }    
]

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
      <AppHeader title='Account'>
      </AppHeader>
      <ScrollView>
        <View style={[container]}>
          <QuestionnaireDetailList subheader='Account Details' listItems={details}></QuestionnaireDetailList>
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
export default Account