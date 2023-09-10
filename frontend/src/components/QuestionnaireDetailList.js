import * as React from 'react';
import { List, MD3Colors, Text } from 'react-native-paper';

const QuestionnaireDetailList = ({subheader='', iconColor=MD3Colors.secondary40, titleColor=MD3Colors.secondary40, fontWeight = '700', listItems = []}) => {    
    return (
        <List.Section>
            <List.Subheader style={{color: iconColor, fontWeight: fontWeight}}>{subheader}</List.Subheader>
            {listItems.map(item => (
                <List.Item 
                    key={item.key}             
                    title={item.value}                    
                    left={() => <List.Icon color={titleColor} icon={item.icon} />}                    
                    titleStyle={{color: titleColor, textTransform: 'lowercase'}}                    
                    titleNumberOfLines={100}
                />            
            ))}        
        </List.Section>
    )
};

export default QuestionnaireDetailList;