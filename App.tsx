import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthRequest } from 'expo-auth-session';
import ConfigAuth from './src/config/auth';
import Login from './src/screens/Login';
import Profile from './src/screens/Profile';

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const [user, setUser] = React.useState<Global.UserProps>({})

  async function requestAuth (platform: 'github' | 'twitter' | 'spotify' | 'reddit' | 'google' | 'facebook') {

    const authPlatform = ConfigAuth[platform]

    const request = new AuthRequest(authPlatform.config);

    const response = await request.promptAsync(authPlatform.discovery);

    const configToken = await authPlatform.getAccessToken(request, response)

    const currentUser = await authPlatform.getUser(configToken.access_token)

    setUser(currentUser)

  }

  return (
    <>
      <StatusBar style="auto" />
      { !user.id ? <Login onAuth={requestAuth} /> : <Profile user={user} /> }
    </>
  );

}