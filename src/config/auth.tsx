import { makeRedirectUri, AuthRequest, AuthSessionResult } from 'expo-auth-session';
import { Buffer } from "buffer";
import { GITHUB_BASE_URL, GITHUB_API_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env"
import { TWITTER_BASE_URL, TWITTER_API_BASE_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "@env"

export default {
    github: {
        config: {
            clientId: GITHUB_CLIENT_ID,
            scopes: ['identity'],
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication' })
        },
        discovery: {
            authorizationEndpoint: `${GITHUB_BASE_URL}/login/oauth/authorize`,
            tokenEndpoint: `${GITHUB_BASE_URL}/login/oauth/access_token`,
            revocationEndpoint: `${GITHUB_BASE_URL}/settings/connections/applications/${GITHUB_CLIENT_ID}`,
        },
        getUser: async function (request: AuthRequest, response: AuthSessionResult) {
            
            //@ts-ignore
            const { code } = response.params

            const generateTokenUrl = `${GITHUB_BASE_URL}/login/oauth/access_token?client_id=${request.clientId}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`

            const responseTokenGenerate = await fetch(generateTokenUrl, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' } })
            
            const configToken = await responseTokenGenerate.json()

            const apiUrl = `${GITHUB_API_BASE_URL}/user`

            const responseUser = await fetch(apiUrl, { method: 'GET', headers: { Authorization: `Bearer ${configToken.access_token}` } })

            const user = await responseUser.json()

            return user

        }
    },
    twitter: {
        config: {
            clientId: TWITTER_CLIENT_ID,
            scopes: ['tweet.read', 'users.read'],
            usePKCE: true,
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication' })
        },
        discovery: {
            authorizationEndpoint: `${TWITTER_BASE_URL}/i/oauth2/authorize`,
            tokenEndpoint: `${TWITTER_BASE_URL}/i/oauth2/token`,
            revocationEndpoint: `${TWITTER_BASE_URL}/i/oauth2/revoke`
        },
        getUser: async function (request: AuthRequest, response: AuthSessionResult) {

            //@ts-ignore
            const { code } = response.params

            const generateTokenUrl = `${TWITTER_API_BASE_URL}/2/oauth2/token`

            const authBase64 = Buffer.from(`${request.clientId}:${TWITTER_CLIENT_SECRET}`).toString('base64')

            const formData = new URLSearchParams();
            //@ts-ignore
            formData.append('code', code);
            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', request.clientId);
            formData.append('code_verifier', (request.codeVerifier || ''));
            formData.append('redirect_uri', request.redirectUri);

            const responseTokenGenerate = await fetch(generateTokenUrl, { 
                method: 'POST', 
                body: formData.toString(), 
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authBase64}`
                } 
            })
            
            const configToken = await responseTokenGenerate.json()

            const apiUrl = `${TWITTER_API_BASE_URL}/2/users/me`

            const responseUser = await fetch(apiUrl, { method: 'GET', headers: { Authorization: `Bearer ${configToken.access_token}` } })

            const user = await responseUser.json()

            return user

        }
    }
}