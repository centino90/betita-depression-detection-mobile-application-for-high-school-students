import React from 'react'
import { BackHandler } from 'react-native'
import AppContainer from '../components/AppContainer'
import StudentQuestionnairePage from '../components/StudentQuestionnairePage'
import fetchAvailableQuestionnaireHook from '../hooks/FetchAvailableQuestionnaireHook'
import { BACKEND_URL } from '@env'
import { useQuery } from 'react-query'
import FetchStudentDataHook from '../hooks/FetchStudentDataHook'

const StudentDashboard = ({ navigation }) => {
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

  const HeaderProps = {
    HeaderTitle: 'PHQ-9 Questionnaire',
    isNestedPage: false
  }

  const NavigationProps = {
    backRoute: '',
    navigation: navigation
  }

  const ContentProps = {
    questionnaire: [],
    visibleActionMessage: visibleActionMessage
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
        memoizedHandleVisibleActionMessage={memoizedHandleVisibleActionMessage}        
      />}
    />
  )
}

export default StudentDashboard