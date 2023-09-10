import * as React from 'react';
import { ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

const _RadioButton = ({radioList, defaultValue='test'}) => {
  const [value, setValue] = React.useState(defaultValue);
    
  return (    
    <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
      <ScrollView horizontal>
        {
          radioList.map((item, index) => (         
            <RadioButton.Item key={index} label={item.value} value={item.value} />
          ))
        }
      </ScrollView>
    </RadioButton.Group>
  );
};

export default _RadioButton;