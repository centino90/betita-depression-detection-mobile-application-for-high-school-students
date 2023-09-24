import * as React from 'react';
import { View } from 'react-native'
import { Avatar, Button, Card, Divider, Text } from 'react-native-paper'
import QuestionnaireDetailList from './QuestionnaireDetailList'
import QuestionnaireQuestionList from './QuestionnaireQuestionList'
import submitAnswersHook from '../hooks/SubmitAnswersHook'
import {BACKEND_URL} from '@env'

const StudentQuestionnairePage = ({ ContentProps, memoizedHandleQuestionnaireTemplate, memoizedHandleVisibleActionMessage }) => {
    const { questionnaire } = ContentProps
    return <DisplayAnsweredQuestionnaire 
        questionnaire={questionnaire} 
        memoizedHandleQuestionnaireTemplate={memoizedHandleQuestionnaireTemplate}
        memoizedHandleVisibleActionMessage={memoizedHandleVisibleActionMessage}
        // handleVisibleActionMessage={handleVisibleActionMessage}
        // setVisibleActionMessage={setVisibleActionMessage}
    />
};

const DisplayNoQuestionnaire = () => {
    return (
        <Card>
            <Card.Content>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar.Icon style={{ backgroundColor: 'orange' }} icon="file-document-edit" />
                </View>
                <Text variant="titleLarge" style={{ textAlign: 'center' }}>Currently, there is no available questionnaire</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>Please check with your administrator for further inquiries</Text>
            </Card.Content>
        </Card>
    )
}

const DisplayAnsweredQuestionnaire = ({questionnaire, memoizedHandleQuestionnaireTemplate, memoizedHandleVisibleActionMessage}) => {
    const [editState, setEditState] = React.useState(false)
    const handleEditState = (state) => {
        setEditState(state)
    }
    const memoizedHandleEditState = React.useCallback(handleEditState, [editState]);

    console.log({editState})
    if(editState === true || questionnaire && questionnaire?.isAnsweredByCurrentUser === undefined) {
        return <DisplayQuestionnaire questionnaire={questionnaire} setEditState={memoizedHandleEditState} memoizedHandleQuestionnaireTemplate={memoizedHandleQuestionnaireTemplate} memoizedHandleVisibleActionMessage={memoizedHandleVisibleActionMessage}/>
    } else if(editState === false && questionnaire && questionnaire?.isAnsweredByCurrentUser === true) {
        return (
            <Card>
                <Card.Content>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar.Icon icon="file-document-edit" />
                    </View>
                    <Text variant="titleLarge" style={{ textAlign: 'center' }}>You already answered the questionnaire</Text>
                    <Text variant="bodyMedium" style={{ textAlign: 'center' }}>Do you want to change your answers? Click the edit button below</Text>
                    <Button mode='contained-tonal' icon='pen' style={{ marginTop: 25 }} onPress={() => memoizedHandleEditState(true)}>Edit Answers</Button>
                </Card.Content>
            </Card>
        )
    } else {
        return <DisplayNoQuestionnaire />
    }
}

const DisplayQuestionnaire = ({ questionnaire, setEditState, memoizedHandleQuestionnaireTemplate, memoizedHandleVisibleActionMessage }) => {
    const details = [
        {
            key: 'description',
            icon: 'comment-text-outline',
            value: questionnaire?.description,
        },
        {
            key: 'createdAt',
            icon: 'clock-edit-outline',
            value: `Created on ${questionnaire?.createdAt}`
        }
    ]

    const questions = questionnaire?.questions?.map((row, index) => {
        const r = row
        row = {}
        row.id = index + 1
        row.question = r
        return row
    })    
    
    const [childAnswers, setChildAnswers] = React.useState(questions?.map((item, index) => {
        if(questionnaire?.currentUserAnswer?.length > 0) {
            return questionnaire?.currentUserAnswer[index]
        } else {
            return null
        }
    }))
    const receiveAnswersFromChild = (index, answer) => {
        const mappedValues = childAnswers?.map((item, mappedIndex) => {
            console.log({mappedIndex, index})
            if(mappedIndex === index) {
                item = answer
            }
            return item
        })
        setChildAnswers(mappedValues)
        console.log({childAnswers})
        console.log({mappedValues})
    }

    const handleAnswersSubmit = () => {
        if(questionnaire?.currentUserAnswer?.length > 0) {  
            console.log('update')
            console.log({childAnswers})
            submitAnswersHook({URL: `${BACKEND_URL}/answers/update/${questionnaire.id}`, payload: {answers: childAnswers}}).then(res => {
                memoizedHandleQuestionnaireTemplate({...questionnaire, answers: childAnswers})
                memoizedHandleVisibleActionMessage(true)
                // handleVisibleActionMessage(true)
                // setEditState(false)
                // setVisibleActionMessage(true)
            })
        } else {
            console.log('create')
            submitAnswersHook({URL: `${BACKEND_URL}/answers/create`, payload: {
                questionnaireId: questionnaire.id,
                answers: childAnswers
            }}).then(res => {
                memoizedHandleQuestionnaireTemplate({...questionnaire, answers: childAnswers})
                memoizedHandleVisibleActionMessage(true)
                // handleVisibleActionMessage(true)
                // setEditState(false)
                // setVisibleActionMessage(true)
            })
        }        
    }

    return (
        <View style={{ marginBottom: 50 }}>
            <QuestionnaireDetailList subheader={questionnaire?.title ?? ''} listItems={details}></QuestionnaireDetailList>
            <Divider />
            <View>
                <QuestionnaireQuestionList subheader='Questions' listItems={questions} answers={questionnaire?.currentUserAnswer} sendAnswersToParent={receiveAnswersFromChild}/>
                <Button style={{ marginTop: 10 }} icon="pen-plus" mode="elevated" onPress={() => handleAnswersSubmit()}>
                    Submit Answer
                </Button>
            </View>
        </View>
    )
}

export default StudentQuestionnairePage;