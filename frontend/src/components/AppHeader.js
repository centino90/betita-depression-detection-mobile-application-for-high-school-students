import * as React from 'react';
import { Appbar } from 'react-native-paper';

const AppHeader = ({ title, navigation, backRoute, isNestedPage }) => {
  const _goBack = () => navigation.navigate(backRoute);

  return (
    <Appbar.Header>
      {
        isNestedPage ? <Appbar.BackAction onPress={_goBack} />
        : ''
      }      
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppHeader;