import * as React from 'react';
import { TextInput } from 'react-native-paper';

const _TextInput = ({label, currentValue = ''}) => {
  const [text, setText] = React.useState(currentValue);

  return (
    <TextInput
      label={label}
      value={text}
      onChangeText={text => setText(text)}
    />
  );
};

export default _TextInput;