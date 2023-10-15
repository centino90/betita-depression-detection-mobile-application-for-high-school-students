import React from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView} from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { useQuery } from 'react-query';
import {BACKEND_URL} from '@env'
import attemptLogin from '../hooks/LoginHook';
import storage from '../storage';

const Login = ({navigation}) => {
  // "force login" user accordingly if session still exist
  React.useEffect(() => {
    storage.getAllDataForKey('currentUser').then(res => {
      if(res[0]?.user.isAdmin === true) {
        navigation.navigate('AdminDashboard')
      } else if(res[0]?.user.isAdmin === false) {
        navigation.navigate('StudentDashboard')
      }
    })
  }, [])
  
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLoginFormSubmit = async (submit) => {
    const {body, header} = await attemptLogin({URL: `${BACKEND_URL}/auth`, payload: {email, password}})
    if(body.data) {      
      storage.save({
        key: 'currentUser',
        id: 1,
        data: {
          user: body.data,
          authToken: header.get('authorization'),
          refreshToken: header.get('set-cookie')
        }
      })

      setEmail("")
      setPassword("")

      if(body.data.isAdmin) {
        navigation.navigate('AdminDashboard')
      } else {
        navigation.navigate('StudentDashboard')
      }
    }
  }

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
        <View style={[container, {marginTop: 150}]}>
            <Text variant="displaySmall" style={{textAlign: 'center'}}>User Login</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={email => setEmail(email)}
                style={{marginTop: 25}}
            />
            <TextInput
                label="Pasword"
                value={password}
                onChangeText={password => setPassword(password)}
                style={{marginTop: 25}}
                secureTextEntry={true}
            />
            <Button icon="login" mode="contained" onPress={() => handleLoginFormSubmit()} style={{marginTop: 35}}>
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