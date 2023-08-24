import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthRequest } from 'expo-auth-session';
import ConfigAuth from '../../config/auth';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  async function requestAuth (platform: 'github') {

    const authPlatform = ConfigAuth[platform]

    const request = new AuthRequest(authPlatform.config);

    const response = await request.promptAsync(authPlatform.discovery);

    //@ts-ignore
    const { code } = response.params

    const user = await authPlatform.getUser(code)

  }

  return (
    <View style={styles.container}>
      <Text>Olá sou uma tela de login</Text>
      <Button title="Login GitHub" color={'black'} onPress={() => requestAuth('github')} />
      <StatusBar style="auto" />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
