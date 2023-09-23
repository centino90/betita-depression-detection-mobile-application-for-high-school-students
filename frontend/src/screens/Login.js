import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native'
import { TextInput, Button } from 'react-native-paper'

const Login = ({navigation}) => {    
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const {
    wrapper,
    container,
  } = styles

  return (   
    <SafeAreaView
    style={[
      wrapper,
      { backgroundColor: '#F5F5F5' }
    ]}
    >      
      <ScrollView>
        <View style={[container]}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <TextInput
                label="Pasword"
                value={password}
                onChangeText={password => setPassword(password)}
            />
            <Button icon="camera" mode="contained" onPress={() => navigation.navigate('authorized')}>
                Submit
            </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 10
  } 
})
export default Login