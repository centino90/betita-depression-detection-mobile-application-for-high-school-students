import * as React from 'react';
import { ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

const _RadioButton = ({radioList, defaultValue=null, sendAnswersToParent, index}) => {
  const [value, setValue] = React.useState(defaultValue);
    
  return (    
    <RadioButton.Group onValueChange={value => {
      setValue(value)
      sendAnswersToParent(index, value)
    }} value={value}>
      <ScrollView horizontal>
        {
          radioList.map((item, index) => (         
            <RadioButton.Item key={index} label={item.name} value={item.value} />
          ))
        }
      </ScrollView>
    </RadioButton.Group>
  );
};

export default _RadioButton;