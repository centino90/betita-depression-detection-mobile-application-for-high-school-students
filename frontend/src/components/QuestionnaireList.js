import * as React from 'react';
import { List, MD3Colors, Text } from 'react-native-paper';

const QuestionnaireList = ({itemPressHandler, subheader, iconColor, titleColor, fontWeight = '500', listItems = []}) => {    
    return (
        <List.Section>
            <List.Subheader style={{color: iconColor, fontWeight: fontWeight}}>{subheader}</List.Subheader>
            {listItems.map(item => (
                <List.Item 
                    key={item.id}             
                    title={item.title}
                    description={item.description}
                    left={() => <List.Icon color={titleColor} icon="file-document-edit" />}
                    right={() => <Text style={{fontSize: 12}}>{item.createdAt}</Text>}
                    titleStyle={{color: titleColor, textTransform: 'capitalize'}}
                    titleEllipsizeMode='tail'
                    titleNumberOfLines={1}
                    descriptionStyle={{color: MD3Colors.secondary60, textTransform: 'lowercase'}}
                    descriptionEllipsizeMode="tail"
                    descriptionNumberOfLines={1}
                    onPress={() => itemPressHandler(item)}
                />            
            ))}        
        </List.Section>
    )
};

export default QuestionnaireList;