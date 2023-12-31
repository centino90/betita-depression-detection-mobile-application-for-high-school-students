import * as React from 'react';
import { Button, List, MD3Colors, Text } from 'react-native-paper';

const QuestionnaireDetailList = ({subheader='', iconColor=MD3Colors.secondary40, titleColor=MD3Colors.secondary40, fontWeight = '700', listItems = []}) => {    
    return (
        <List.Section>            
            <Text style={{color: iconColor, fontWeight: fontWeight, fontSize: 20}}>{subheader}</Text>
            {listItems.map(item => (
                <List.Item 
                    key={item.key}             
                    title={item.value}                    
                    left={() => <List.Icon color={titleColor} icon={item.icon} />}                    
                    right={() => item?.editLabel ? <Button mode="text" icon="pen">edit</Button> : ''}
                    titleStyle={{color: titleColor, textTransform: 'lowercase'}}                    
                    titleNumberOfLines={100}
                    description={item?.description ?? ''}
                    descriptionStyle={{color: MD3Colors.secondary60, textTransform: 'lowercase'}}
                />            
            ))}        
        </List.Section>
    )
};

export default QuestionnaireDetailList;