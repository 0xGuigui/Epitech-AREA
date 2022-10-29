import * as store from '../store'

// Must be true to avoid undefined localStorage
export const ssr = false;

export function load() {
    const accessToken: string | null = localStorage.getItem('accessToken')

    if (accessToken) {
        store.loggedIn.set(true)
        store.accessToken.set(accessToken)
    }
    return {
        accessToken: accessToken,
    }
}
