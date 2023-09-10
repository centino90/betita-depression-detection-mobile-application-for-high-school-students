import * as React from 'react';
import { Checkbox } from 'react-native-paper';

const _Checkbox = ({label, isChecked = false}) => {
  const [checked, setChecked] = React.useState(false);

  return (    
    <Checkbox.Item
      label={label}
      status={checked || isChecked ? 'checked' : 'unchecked'}
      onPress={() => {
        setChecked(!checked);
      }}
    />
  );
};

export default _Checkbox;