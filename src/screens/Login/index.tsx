import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthRequest } from 'expo-auth-session';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ConfigAuth from '../../config/auth';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  async function requestAuth (platform: 'github' | 'twitter' | 'spotify' | 'reddit') {

    const authPlatform = ConfigAuth[platform]

    const request = new AuthRequest(authPlatform.config);

    const response = await request.promptAsync(authPlatform.discovery);

    const user = await authPlatform.getUser(request, response)

  }

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>  
        <Text style={styles.title}>
          Bem-vindo ao Autenticador social
        </Text>
        <Text style={styles.description}>
          Este app utiliza a autenticação do tipo OAuth e atualmente a mesma 
          funciona com as plataformas abaixo:
        </Text>
      </View>
      <View style={styles.containerButton}>
        <FontAwesome.Button name="github" style={styles.button} backgroundColor="#000000" 
          size={30} onPress={() => requestAuth('github')}>
          Login com Github
        </FontAwesome.Button>
        <FontAwesome.Button name="twitter" style={styles.button} backgroundColor="#1DA1F2" 
          size={30} onPress={() => requestAuth('twitter')}>
          Login com Twitter
        </FontAwesome.Button>
        <FontAwesome.Button name="spotify" style={styles.button} backgroundColor="#1DB954" 
          size={30} onPress={() => requestAuth('spotify')}>
          Login com Spotify
        </FontAwesome.Button>
        <FontAwesome.Button name="reddit" style={styles.button} backgroundColor="#ff6314" 
          size={30} onPress={() => requestAuth('reddit')}>
          Login com Reddit
        </FontAwesome.Button>
        <StatusBar style="auto" />
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: '10%'
  },
  containerText: {
    marginBottom: 15
  },
  containerButton: {
    height: '35%', 
    justifyContent: 'space-evenly'
  },
  title: {    
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  description: {    
    fontSize: 14,
    textAlign: 'center'
  },
  button: {    
    justifyContent: 'center',
    padding: 10
  }
});
