import * as React from 'react';
import { View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, Divider, Text } from 'react-native-paper'
import QuestionnaireDetailList from './QuestionnaireDetailList'
import QuestionnaireQuestionList from './QuestionnaireQuestionList'
import submitAnswersHook from '../hooks/SubmitAnswersHook'
import { BACKEND_URL } from '@env'
import { useQuery } from 'react-query';
import FetchStudentDataHook from '../hooks/FetchStudentDataHook';

const StudentQuestionnairePage = ({ ContentProps, memoizedHandleVisibleActionMessage }) => {
    const questions = [
        {
            id: 1,
            question: 'Little enjoyment or interest in activities'
        },
        {
            id: 1,
            question: 'Having a negative, downbeat, or gloomy attitude'
        },
        {
            id: 1,
            question: 'Having difficulty getting asleep, staying asleep, or oversleeping'
        },
        {
            id: 1,
            question: 'Feeling exhausted or low in energy'
        },
        {
            id: 1,
            question: 'Lack of appetite or excessive eating'
        },
        {
            id: 1,
            question: 'Do you feel inadequate, like a failure, or that you have disappointed your family or yourself?'
        },
        {
            id: 1,
            question: 'Finding it difficult to focus while doing tasks like reading the papers or watching television'
        },
        {
            id: 1,
            question: 'Speaking or moving so slowly that others would have noticed. Alternately, being excessively restless or fidgety, which has caused you to move much more than normal'
        },
        {
            id: 1,
            question: 'Thoughts that you would be better dead, or that you would harm yourself somehow'
        },
    ]
    const { visibleActionMessage } = ContentProps

    const { isLoading, error, data, refetch } = useQuery('studentdata', () =>
        FetchStudentDataHook({ URL: `${BACKEND_URL}/admin/student` }, {
            retry: 1,
            manual: true
        })
    )

    const [editState, setEditState] = React.useState(false)
    const handleEditState = (state) => {
        setEditState(state)
    }
    const memoizedHandleEditState = React.useCallback(handleEditState, [editState])

    const [childAnswers, setChildAnswers] = React.useState(data?.body?.data?.answer ?? [])
    const handleSetChildAnswers = (answer) => {
        setChildAnswers(answer)
    }
    const memoizedHandleChildAnswers = React.useCallback(handleSetChildAnswers, [childAnswers])

    const receiveAnswersFromChild = (index, answer) => {
        const mappedValues = childAnswers?.map((item, mappedIndex) => {
            if (mappedIndex === index) {
                item = answer
            }
            return item
        })
        memoizedHandleChildAnswers(mappedValues)
    }

    const handleAnswersSubmit = () => {
        submitAnswersHook({ URL: `${BACKEND_URL}/student/saveAnswer`, payload: { answer: childAnswers } }).then(res => {
            refetch().then(res => {
                memoizedHandleVisibleActionMessage(true)
                memoizedHandleEditState(false)
            })
        })
    }

    React.useEffect(() => {
        if(data) {            
            const hasAnswered = data.body.data.answer.filter(row => parseInt(row) >= 0).length > 0
            memoizedHandleEditState(hasAnswered ? false : true)
            memoizedHandleChildAnswers(data.body.data.answer)
        }        
    }, [data])

    if (isLoading) {
        return <ActivityIndicator animating={true} size={22} />
    }

    return <DisplayAnsweredQuestionnaire
        answers={data?.body?.data?.answer ?? []}
        symptom={data?.body?.data?.symptom}
        isNotificationConfirmed={data?.body?.data?.isNotificationConfirmed}
        isNotified={data?.body?.data?.isNotified}
        visibleActionMessage={visibleActionMessage}
        editState={editState}
        memoizedHandleEditState={memoizedHandleEditState}
        receiveAnswersFromChild={receiveAnswersFromChild}
        questions={questions}
        handleAnswersSubmit={handleAnswersSubmit}
    />
};

const DisplayAnsweredQuestionnaire = ({ answers, symptom, isNotificationConfirmed, isNotified, editState, memoizedHandleEditState, receiveAnswersFromChild, questions, handleAnswersSubmit }) => {
    if (editState === true) {
        return (
            <View style={{ marginBottom: 50 }}>
                <Divider />
                <View>
                    <QuestionnaireQuestionList subheader='Questions' listItems={questions} answers={answers} sendAnswersToParent={receiveAnswersFromChild} />
                    <Button style={{ marginTop: 10 }} icon="pen-plus" mode="elevated" onPress={() => handleAnswersSubmit()}>
                        Submit Answer
                    </Button>
                </View>
            </View>
        )
    } else {
        return (
            <Card>
                <Card.Content>
                    {/* <View style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar.Icon icon="file-document-edit" />
                    </View> */}
                    <Text variant="titleLarge" style={{ textAlign: 'left' }}>Your initial PHQ-9 depression assessment is <Text style={{ fontWeight: 'bold' }}>{symptom}</Text></Text>
                    {isNotified === false && isNotificationConfirmed === false
                        ? <>
                            {symptom !== 'minimal'
                                ? <Text variant="bodyMedium" style={{ textAlign: 'left', marginTop: 5 }}>Please wait for the email notification of your consultation</Text>
                                : <Text variant="bodyMedium" style={{ textAlign: 'left', marginTop: 5 }}>You're completely fine</Text>
                            }
                            <Text variant="bodySmall" style={{ textAlign: 'center', marginTop: 25 }}>Do you want to change your answers? Click the edit button below</Text>
                            <Button mode='contained-tonal' icon='pen' style={{ marginTop: 15 }} onPress={() => memoizedHandleEditState(true)}>Edit Answers</Button>
                        </>
                        : <Text variant="bodyMedium" style={{ textAlign: 'left', marginTop: 5 }}>You've already confirmed the schedule for consultation</Text>
                    }
                </Card.Content>
            </Card>
        )
    }
}

export default StudentQuestionnairePage;