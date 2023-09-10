import * as React from 'react';
import { List, MD3Colors, Text, Checkbox, View, Badge } from 'react-native-paper';
import _Checkbox from './Checkbox';
import _RadioButton from './RadioButton';

const answerOptions = [
    {
        value: 'first'
    },
    {
        value: 'second'
    },
    {
        value: 'third'
    },
    {
        value: 'fourth'
    },
    {
        value: 'fifth'
    },                
]


const AnswerSectionComponent = () => (    
    <_RadioButton radioList={answerOptions}/>
)

const QuestionnaireQuestionList = ({subheader='', iconColor=MD3Colors.secondary40, titleColor=MD3Colors.secondary40, fontWeight = '700', listItems = []}) => {    
    return (
        <List.Section>
            <List.Subheader style={{color: iconColor, fontWeight: fontWeight}}>{subheader}</List.Subheader>
            {listItems.map((item, index) => (
                <List.Item 
                    key={index}             
                    title={item.question}                    
                    left={() =>  <Text>{index + 1}</Text>}                    
                    titleStyle={{color: titleColor, textTransform: 'lowercase'}}                    
                    titleNumberOfLines={100}
                    description={AnswerSectionComponent}
                />            
            ))}        
        </List.Section>
    )
};

export default QuestionnaireQuestionList;