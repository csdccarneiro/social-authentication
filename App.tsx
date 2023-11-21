import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthRequest } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfigAuth from './src/config/auth';
import Login from './src/screens/Login';
import Profile from './src/screens/Profile';

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const [user, setUser] = useState<Global.UserProps>({})

  //SALVANDO OS DADOS DO USUÁRIO
  const saveUser = useCallback(async (value: Global.UserProps) => {

    const jsonValue = JSON.stringify(value);
        
    await AsyncStorage.setItem('@user', jsonValue);

    setUser(value)

  }, [])

  //PEGANDO DADOS SALVOS DO USUÁRIO
  const getUser = useCallback(async () => {

    const jsonStringValue = await AsyncStorage.getItem('@user') || JSON.stringify({});
      
    const jsonValue = JSON.parse(jsonStringValue);
      
    setUser(jsonValue)

  }, [])

  //REMOVENDO DADOS SALVOS DO USUÁRIO
  const removeUser = useCallback(async () => {

    await AsyncStorage.removeItem('@user')

    setUser({})

  }, [])

  useEffect(() => {

    try {

      getUser()
    
    } catch (err) {
      
      console.log(err)

    }

  }, [])


  //MÉTODO QUE FAZ AUTENTICAÇÃO OAUTH NAS PLATAFORMAS
  async function requestLogin (platform: 'github' | 'twitter' | 'spotify' | 'reddit' | 'google' | 'facebook') {

    try {

      const authPlatform = ConfigAuth[platform]

      const request = new AuthRequest(authPlatform.config);

      const response = await request.promptAsync(authPlatform.discovery);

      const configToken = await authPlatform.getAccessToken(request, response)

      const currentUser = await authPlatform.getUser(configToken.access_token)

      saveUser(currentUser)
    
    } catch (err) {

      console.log(err)

    }

  }


  //MÉTODO QUE DESLOGA O USUÁRIO
  async function requestLogout () {

    Alert.alert('Sair', 'Deseja realmente deslogar?', [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Ok', 
        onPress: () => {

          try {
            
            removeUser()

          } catch(err) {

            console.log(err)

          }
          
        }
      }
    ]);

  }

  return (
    <>
      <StatusBar style="auto" />
      { !user.id ? <Login onLogin={requestLogin} /> : <Profile user={user} onLogout={requestLogout} /> }
    </>
  );

}