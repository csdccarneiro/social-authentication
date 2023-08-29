import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthRequest } from 'expo-auth-session';
import ConfigAuth from '../../config/auth';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  async function requestAuth (platform: 'github' | 'twitter') {

    const authPlatform = ConfigAuth[platform]

    const request = new AuthRequest(authPlatform.config);

    const response = await request.promptAsync(authPlatform.discovery);

    const user = await authPlatform.getUser(request, response)

  }

  return (
    <View style={styles.container}>
      <Text>Olá sou uma tela de login</Text>
      <Button title="Login GitHub" color={'black'} onPress={() => requestAuth('github')} />
      <Button title="Login Twitter" color={'blue'} onPress={() => requestAuth('twitter')} />
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
