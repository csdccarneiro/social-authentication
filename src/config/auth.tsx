import { makeRedirectUri } from 'expo-auth-session';
import { GITHUB_BASE_URL, GITHUB_API_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env"

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
        getUser: async function (code: string) {
            
            const generateTokenUrl = `${GITHUB_BASE_URL}/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`

            const responseTokenGenerate = await fetch(generateTokenUrl, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' } })
            
            const configToken = await responseTokenGenerate.json()

            const apiUrl = `${GITHUB_API_BASE_URL}/user`

            const responseUser = await fetch(apiUrl, { method: 'GET', headers: { Authorization: `Bearer ${configToken.access_token}` } })

            const user = await responseUser.json()

            return user

        }
    }
}