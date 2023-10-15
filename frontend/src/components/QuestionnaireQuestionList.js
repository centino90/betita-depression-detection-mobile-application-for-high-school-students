import * as React from 'react';
import { List, MD3Colors, Text, Checkbox, Badge, Divider, Chip } from 'react-native-paper';
import _Checkbox from './Checkbox';
import _RadioButton from './RadioButton';
import { View } from 'react-native';

// Not at all = 0, A few days = 1, More than half the days = 2, and Almost every day = 3\

const answerOptions = [
    {
        name: 'Not at all',
        value: 0
    },
    {
        name: 'A few days',
        value: 1
    },
    {
        name: 'More than half the days',
        value: 2
    },
    {
        name: 'Almost every day',
        value: 3
    }
]

const AnswerSectionComponent = ({answer, sendAnswersToParent, index}) => {
    return <_RadioButton radioList={answerOptions} defaultValue={answer} sendAnswersToParent={sendAnswersToParent} index={index}/>
}

const QuestionnaireQuestionList = ({subheader='', iconColor=MD3Colors.secondary40, titleColor=MD3Colors.secondary40, fontWeight = '700', listItems = [], answers = [], sendAnswersToParent}) => {    
    return (
        <List.Section>                        
            <Text style={{color: titleColor, marginBottom: 20, marginTop: 10, fontSize: 15}}>
                How often have you had the following symptoms below over the past 2 weeks, including today?
                Please give your honest rating to each item in the list
            </Text>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: 10}}>
                <Text style={{width: '100%'}}>0 - Not at all</Text>
                <Text style={{width: '100%'}}>1 - A few days</Text>
                <Text style={{width: '100%'}}>2 - More than half the days</Text>                
                <Text style={{width: '100%'}}>3 - Almost every day</Text>  
            </View>
            {listItems.map((item, index) => (
                <List.Item 
                    key={index}             
                    title={item.question}                    
                    left={() =>  <Text style={{fontWeight: fontWeight, color: titleColor}}>{`${index + 1}.`}</Text>}                    
                    titleStyle={{color: titleColor, textTransform: 'lowercase'}}                    
                    titleNumberOfLines={100}
                    description={() => <AnswerSectionComponent answer={answers[index]} sendAnswersToParent={sendAnswersToParent} index={index}/>}
                />            
            ))}        
        </List.Section>
    )
};

export default QuestionnaireQuestionList;