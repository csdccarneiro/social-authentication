import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface LoginProps {
  onLogin: (platform: 'github' | 'twitter' | 'spotify' | 'reddit' | 'google' | 'facebook') => void
}

export default function Login({ onLogin }: LoginProps) {

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>  
        <Text style={styles.title}>
          Bem-vindo ao Autenticador social
        </Text>
        <Text style={styles.description}>
          Este app utiliza a autenticação do tipo OAuth e atualmente a mesma funciona com as plataformas abaixo:
        </Text>
      </View>
      <View style={styles.containerButton}>
        <FontAwesome.Button name="google" style={styles.button} backgroundColor="#d62d20" 
          size={30} onPress={() => onLogin('google')}>
          Login com Google
        </FontAwesome.Button>
        <FontAwesome.Button name="github" style={styles.button} backgroundColor="#000000" 
          size={30} onPress={() => onLogin('github')}>
          Login com Github
        </FontAwesome.Button>
        <FontAwesome.Button name="twitter" style={styles.button} backgroundColor="#1DA1F2" 
          size={30} onPress={() => onLogin('twitter')}>
          Login com Twitter
        </FontAwesome.Button>
        <FontAwesome.Button name="spotify" style={styles.button} backgroundColor="#1DB954" 
          size={30} onPress={() => onLogin('spotify')}>
          Login com Spotify
        </FontAwesome.Button>
        <FontAwesome.Button name="reddit" style={styles.button} backgroundColor="#ff6314" 
          size={30} onPress={() => onLogin('reddit')}>
          Login com Reddit
        </FontAwesome.Button>
        <FontAwesome.Button name="facebook" style={styles.button} backgroundColor="#3b5998" 
          size={30} onPress={() => onLogin('facebook')}>
          Login com Facebook
        </FontAwesome.Button>
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
    height: '50%', 
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
    padding: 13
  }
});