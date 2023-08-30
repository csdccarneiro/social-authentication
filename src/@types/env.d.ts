/* TIPAGEM PARA VARIÁVEIS DE AMBIENTE DO ARQUIVO .ENV */

declare module '@env' {
    export const GITHUB_BASE_URL: string;
    export const GITHUB_API_BASE_URL: string;
    export const GITHUB_CLIENT_ID: string;
    export const GITHUB_CLIENT_SECRET: string;

    export const TWITTER_BASE_URL: string;
    export const TWITTER_API_BASE_URL: string;
    export const TWITTER_CLIENT_ID: string;
    export const TWITTER_CLIENT_SECRET: string;

    export const SPOTIFY_BASE_URL: string;
    export const SPOTIFY_API_BASE_URL: string;
    export const SPOTIFY_CLIENT_ID: string;
    export const SPOTIFY_CLIENT_SECRET: string;
}