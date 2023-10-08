import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

const AppActionMessage = ({message = '', visibleActionMessage, memoizedHandleVisibleActionMessage}) => {
  const onToggleSnackBar = () => memoizedHandleVisibleActionMessage(!visibleActionMessage);
  const onDismissSnackBar = () => memoizedHandleVisibleActionMessage(false);
  if(!visibleActionMessage) {
    return <></>
  }
  return (
    <View style={styles.container}>
      <Button onPress={onToggleSnackBar}></Button>
      <Snackbar
        duration={1000}
        visible={visibleActionMessage}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            memoizedHandleVisibleActionMessage(false)
          },
        }}>
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default AppActionMessage;