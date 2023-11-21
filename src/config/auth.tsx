import { makeRedirectUri, AuthRequest, AuthSessionResult } from 'expo-auth-session';
import { Buffer } from "buffer";
import axios from "axios";
import { GOOGLE_BASE_URL, GOOGLE_OAUTH_BASE_URL, GOOGLE_API_BASE_URL, GOOGLE_CLIENT_ID } from "@env"
import { GITHUB_BASE_URL, GITHUB_API_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env"
import { TWITTER_BASE_URL, TWITTER_API_BASE_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "@env"
import { SPOTIFY_BASE_URL, SPOTIFY_API_BASE_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@env"
import { REDDIT_BASE_URL, REDDIT_API_BASE_URL, REDDIT_CLIENT_ID } from "@env"
import { FACEBOOK_BASE_URL, FACEBOOK_API_BASE_URL, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from "@env"


/* CONFIGURAÇÕES E MÉTODOS PARA AUTENTICAÇÃO OAUTH NAS PLATAFORMAS */
export default {
    github: {
        config: {
            clientId: GITHUB_CLIENT_ID,
            scopes: [
                'identity'
            ],
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication' })
        },
        discovery: {
            authorizationEndpoint: `${GITHUB_BASE_URL}/login/oauth/authorize`,
            tokenEndpoint: `${GITHUB_BASE_URL}/login/oauth/access_token`,
            revocationEndpoint: `${GITHUB_BASE_URL}/settings/connections/applications/${GITHUB_CLIENT_ID}`,
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {

            //@ts-ignore
            const { code } = response.params

            const responseTokenGenerate = await axios.post(`${GITHUB_BASE_URL}/login/oauth/access_token`, {}, {
                params: {
                    client_id: request.clientId,
                    client_secret: GITHUB_CLIENT_SECRET, 
                    code: code
                },
                headers: { 
                    Accept: 'application/json' 
                }
            })

            return responseTokenGenerate.data

        },  
        getUser: async function (access_token: string): Promise<Global.UserProps> {
            
            const response = await axios.get(`${GITHUB_API_BASE_URL}/user`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                }
            })

            const user = response.data

            return {
                id: String(user.id),
                name: user.name || user.login,
                email: user.email,
                avatarUrl: user.avatar_url
            }

        }
    },
    twitter: {
        config: {
            clientId: TWITTER_CLIENT_ID,
            scopes: [
                'tweet.read', 
                'users.read'
            ],
            usePKCE: true,
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication' })
        },
        discovery: {
            authorizationEndpoint: `${TWITTER_BASE_URL}/i/oauth2/authorize`,
            tokenEndpoint: `${TWITTER_BASE_URL}/i/oauth2/token`,
            revocationEndpoint: `${TWITTER_BASE_URL}/i/oauth2/revoke`
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {

            //@ts-ignore
            const { code } = response.params

            const formData = new URLSearchParams();
            //@ts-ignore
            formData.append('code', code);
            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', request.clientId);
            formData.append('code_verifier', (request.codeVerifier || ''));
            formData.append('redirect_uri', request.redirectUri);

            const authBase64 = Buffer.from(`${request.clientId}:${TWITTER_CLIENT_SECRET}`).toString('base64')

            const responseTokenGenerate = await axios.post(`${TWITTER_API_BASE_URL}/2/oauth2/token`, formData.toString(), {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authBase64}`
                }
            })

            return responseTokenGenerate.data

        },
        getUser: async function (access_token: string): Promise<Global.UserProps> {

            const response = await axios.get(`${TWITTER_API_BASE_URL}/2/users/me`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                },
                params: {
                    'user.fields': 'profile_image_url'
                }
            })

            const user = response.data.data

            return {
                id: String(user.id),
                name: user.name, 
                email: user.username,
                avatarUrl: user.profile_image_url
            }

        }
    },
    spotify: {
        config: {
            clientId: SPOTIFY_CLIENT_ID,
            scopes: [
                'user-read-email', 
                'playlist-modify-public'
            ],
            usePKCE: false,
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication' })
        },
        discovery: {
            authorizationEndpoint: `${SPOTIFY_BASE_URL}/authorize`,
            tokenEndpoint: `${SPOTIFY_BASE_URL}/api/token`
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {

            //@ts-ignore
            const { code } = response.params

            const formData = new URLSearchParams();
            //@ts-ignore
            formData.append('code', code);
            formData.append('grant_type', 'authorization_code');
            formData.append('redirect_uri', request.redirectUri);

            const authBase64 = Buffer.from(`${request.clientId}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

            const responseTokenGenerate = await axios.post(`${SPOTIFY_BASE_URL}/api/token`, formData.toString(), {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authBase64}`
                }
            })

            return responseTokenGenerate.data

        },
        getUser: async function (access_token: string): Promise<Global.UserProps> {
            
            const response = await axios.get(`${SPOTIFY_API_BASE_URL}/v1/me`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                }
            })

            const user = response.data

            const images = (user.images.length > 0 ? user.images : [{ width: 300, height: 300, url: '' }])

            return {
                id: String(user.id),
                name: user.display_name,
                email: user.email,
                avatarUrl: images.filter(img => img.width === 300 || img.height === 300)[0].url
            }

        }
    },
    reddit: {
        config: {
            clientId: REDDIT_CLIENT_ID,
            scopes: [
                'identity'
            ],
            usePKCE: false,
            redirectUri: makeRedirectUri({ scheme: 'socialauthentication', path: 'redirect' })
        },
        discovery: {
            authorizationEndpoint: `${REDDIT_BASE_URL}/api/v1/authorize.compact`,
            tokenEndpoint: `${REDDIT_BASE_URL}/api/v1/access_token`
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {

            //@ts-ignore
            const { code } = response.params

            const formData = new URLSearchParams();
            //@ts-ignore
            formData.append('code', code);
            formData.append('grant_type', 'authorization_code');
            formData.append('redirect_uri', request.redirectUri);

            const authBase64 = Buffer.from(`${request.clientId}:`).toString('base64')

            const responseTokenGenerate = await axios.post(`${REDDIT_BASE_URL}/api/v1/access_token`, formData.toString(), {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authBase64}`
                }
            })

            return responseTokenGenerate.data

        },
        getUser: async function (access_token: string): Promise<Global.UserProps> {

            const response = await axios.get(`${REDDIT_API_BASE_URL}/api/v1/me`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                }
            })

            const user = response.data

            return {
                id: String(user.id),
                name: user.name,
                email: user.name,
                avatarUrl: user.icon_img
            }

        }
    },
    google: {
        config: {
            clientId: GOOGLE_CLIENT_ID,
            scopes: [
                'email',
                'profile'
            ],
            usePKCE: false,
            redirectUri:  makeRedirectUri({ native: 'com.csdccarneiro.socialauthentication:/oauth2redirect' })
        },
        discovery: {
            authorizationEndpoint: `${GOOGLE_BASE_URL}/o/oauth2/v2/auth`
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {

            //@ts-ignore
            const { code } = response.params

            const formData = new URLSearchParams();
            //@ts-ignore
            formData.append('code', code);
            formData.append('grant_type', 'authorization_code');
            formData.append('redirect_uri', request.redirectUri);
            formData.append('client_id', request.clientId);

            const responseTokenGenerate = await axios.post(`${GOOGLE_OAUTH_BASE_URL}/token`, formData.toString(), {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            return responseTokenGenerate.data

        },
        getUser: async function (access_token: string): Promise<Global.UserProps> {

            const response = await axios.get(`${GOOGLE_API_BASE_URL}/userinfo/v2/me`, {
                headers: { 
                    Authorization: `Bearer ${access_token}` 
                }
            })

            const user = response.data

            return {
                id: String(user.id),
                name: user.name,
                email: user.email,
                avatarUrl: user.picture
            }

        }
    },
    facebook: {
        config: {
            clientId: FACEBOOK_CLIENT_ID,
            usePKCE: false,
            redirectUri: `fb${FACEBOOK_CLIENT_ID}://authorize/`
        },
        discovery: {
            authorizationEndpoint: `${FACEBOOK_BASE_URL}/v18.0/dialog/oauth`
        },
        getAccessToken: async function (request: AuthRequest, response: AuthSessionResult): Promise<Global.TokenProps> {
            
            //@ts-ignore
            const { code } = response.params
    
            const responseTokenGenerate = await axios.get(`${FACEBOOK_API_BASE_URL}/v18.0/oauth/access_token`, {
                params: {
                    client_id: FACEBOOK_CLIENT_ID,
                    redirect_uri: request.redirectUri,
                    client_secret: FACEBOOK_CLIENT_SECRET,
                    code: code
                }
            })
    
            return responseTokenGenerate.data
    
        },
        getUser: async function (access_token: string): Promise<Global.UserProps> {
    
            const response = await axios.get(`${FACEBOOK_API_BASE_URL}/me`, {
                params: {
                    access_token,
                    fields: 'id,name,email,picture.type(large)'
                }
            })

            const user = response.data
    
            return {
                id: String(user.id),
                name: user.name,
                email: user.email,
                avatarUrl: user.picture.data.url
            }
    
        }
    }
}