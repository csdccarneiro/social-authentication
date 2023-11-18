import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ProfileProps {
  user: Global.UserProps
}

export default function Profile({ user }: ProfileProps) {

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
    marginTop: 10
  },
  avatar: { 
    width: 100, 
    height: 100,
    marginBottom: 10
  },
  text: {
    fontWeight: 'bold'
  }
});
