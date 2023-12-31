/* NAMESPACE PARA TIPAGENS GLOBAIS */

declare namespace Global {

    interface TokenProps {
        access_token: string,
        scope: string
        token_type: 'bearer',
        expires_in?: number,
        refresh_token?: string
    }

    interface UserProps {
        id?: string,
        name?: string,
        email?: string,
        avatarUrl?: string
    }

}