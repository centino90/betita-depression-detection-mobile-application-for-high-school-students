import React from 'react'
import { BackHandler } from 'react-native'
import AppContainer from '../components/AppContainer'
import StudentQuestionnairePage from '../components/StudentQuestionnairePage'
import fetchAvailableQuestionnaireHook from '../hooks/FetchAvailableQuestionnaireHook'
import {BACKEND_URL} from '@env'

const StudentDashboard = ({ navigation }) => {
  const [questionnaire, setQuestionnaire] = React.useState({})
  const handleQuestionnaire = (state = {}) => {
    setQuestionnaire(state)
  }
  const memoizedHandleQuestionnaire = React.useCallback(handleQuestionnaire, []);  

  const [questionnaireTemplate, setQuestionnaireTemplate] = React.useState({})
  const handleQuestionnaireTemplate = (state = {}) => {
    setQuestionnaireTemplate(state)
  }
  const memoizedHandleQuestionnaireTemplate = React.useCallback(handleQuestionnaireTemplate, []);  

  const [visibleActionMessage, setVisibleActionMessage] = React.useState(false)
  const handleVisibleActionMessage = (state) => {
    setVisibleActionMessage(state)
  }
  const memoizedHandleVisibleActionMessage = React.useCallback(handleVisibleActionMessage, []);


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
  React.useEffect(() => {
    fetchAvailableQuestionnaireHook({URL: `${BACKEND_URL}/questionnaires/available`}).then(res => memoizedHandleQuestionnaire(res.body.data))
    console.log('refetch', questionnaireTemplate)
  }, [questionnaireTemplate])


  const HeaderProps = {
    HeaderTitle: 'Student Dashboard',
    isNestedPage: false
  }

  const NavigationProps = {
    backRoute: '',
    navigation: navigation
  }

  const ContentProps = {
    questionnaire: questionnaire
  }

  const MessageProps = {
    message: 'Answers are successfully saved',
    visibleActionMessage,
    memoizedHandleVisibleActionMessage
  }

  return (
    <AppContainer 
      HeaderProps={HeaderProps}
      NavigationProps={NavigationProps} 
      MessageProps={MessageProps}
      AppContent={() => <StudentQuestionnairePage  
        ContentProps={ContentProps} 
        memoizedHandleQuestionnaireTemplate={memoizedHandleQuestionnaireTemplate} 
        memoizedHandleVisibleActionMessage={memoizedHandleVisibleActionMessage}
      />}
    />
  )
}

export default StudentDashboard