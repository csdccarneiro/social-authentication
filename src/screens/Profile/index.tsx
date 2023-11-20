import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ProfileProps {
  user: Global.UserProps,
  onLogout: () => void
}

export default function Profile({ user, onLogout }: ProfileProps) {

  return (
    <View style={styles.container}>      
      <StatusBar style="auto" />
      {
        (
          user.avatarUrl ? 
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} /> 
          : 
            <FontAwesome name="user" size={100} color={'blue'} />
        )
      }
      <View style={styles.containerDescription}>
        <Text style={styles.text}>User ID: </Text>
        <Text>{user.id}</Text>
      </View>
      <View style={styles.containerDescription}>
        <Text style={styles.text}>Nome: </Text>
        <Text>{user.name}</Text>
      </View>
      <View style={styles.containerDescription}>
        <Text style={styles.text}>E-mail: </Text>
        <Text>{user.email}</Text>
      </View>
      <FontAwesome.Button name="close" backgroundColor="#d62d20" size={20} onPress={onLogout}>
        Sair
      </FontAwesome.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDescription: { 
    flexDirection: 'row', 
    alignItems: 'center',    
    marginBottom: 20
  },
  avatar: { 
    width: 100, 
    height: 100,
    marginBottom: 20
  },
  text: {
    fontWeight: 'bold'
  }
});
