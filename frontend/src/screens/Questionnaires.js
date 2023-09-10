import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import AppHeader from '../components/AppHeader'
import QuestionnaireList from '../components/QuestionnaireList'
import { MD3Colors } from 'react-native-paper'
import moment from 'moment'

const Questionnaires = ({ navigation }) => {  
  const handleListItemPress = (item) => {    
    navigation.navigate('questionDetail', item);    
  };

  const {
    wrapper,
    container,
  } = styles

  const listItems = [
    {
      id: 3,
      title: 'Personality Quiz 1',
      description: 'lorem ipsum',
      createdAt: moment('2023-09-08T14:59-0500').fromNow(),
      createTimestamp: moment('2023-09-08T14:59-0500').format('LLL')
    },
    {
      id: 2,
      title: 'Personality Exam 1',
      description: 'lorem ipsum dolor exte',
      createdAt: moment('2023-09-08T12:59-0500').fromNow(),
      createTimestamp: moment('2023-09-08T12:59-0500',).format('LLL')
    },
    {
      id: 1,
      title: 'Personality Questionnaire 1',
      description: 'lorem ipsum dolor exte lorem ipsum dolor exte lorem ipsum dolor exte',
      createdAt: moment('2023-09-07T12:59-0500').fromNow(),
      createTimestamp: moment('2023-09-07T12:59-0500').format('LLL')
    }    
  ]

  return (   
    <SafeAreaView
    style={[
      wrapper,
      { backgroundColor: '#F5F5F5' }
    ]}
    >
      <AppHeader title='Questionnaires'>
      </AppHeader>
      <ScrollView>
        <View style={container}>        
          <QuestionnaireList itemPressHandler={handleListItemPress} subheader={'Newly Added'} iconColor={MD3Colors.primary60} titleColor={MD3Colors.secondary20} fontWeight='700' listItems={[listItems[1], listItems[2]]} />
          <QuestionnaireList itemPressHandler={handleListItemPress} subheader={'Recently Accessed'} iconColor={MD3Colors.secondary40} titleColor={MD3Colors.secondary40} listItems={[listItems[0]]}/>
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
export default Questionnaires