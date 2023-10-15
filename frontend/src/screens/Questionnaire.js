import React from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import AppHeader from '../components/AppHeader'
import { Divider, Button } from 'react-native-paper'
import QuestionnaireDetailList from '../components/QuestionnaireDetailList'
import QuestionnaireQuestionList from '../components/QuestionnaireQuestionList'

const Questionnaire = ({ navigation, ...props }) => {
  const params = props.route.params  
  const details = [
      {
        key: 'description',
        icon: 'comment-text-outline',
        value: params?.description,
      },
      {
        key: 'createdAt',
        icon: 'clock-edit-outline',
        value: `Created on ${params?.createTimestamp}`
      }    
  ]
  const questions = [
    {
      id: 1,
      question: 'How are you?'
    },
    {
      id: 2,
      question: 'How are you?'
    },
    {
      id: 3,
      question: 'How are you?'
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
      <AppHeader title='Questionnaire Details' backRoute='questionnaires' navigation={navigation} isNestedPage={true}>
      </AppHeader>
      <ScrollView>
        <View style={container}>
          <QuestionnaireDetailList subheader={params?.title ?? ''} listItems={details}></QuestionnaireDetailList>
          <Divider />
          <View>
            <QuestionnaireQuestionList subheader='Questions' listItems={questions}/>
            <Button style={{marginTop: 10}} icon="pen-plus" mode="elevated">
              Submit Answer
            </Button>
          </View>
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
    padding: 10,
    paddingBottom: 100
  }
})
export default Questionnaire