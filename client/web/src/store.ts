import { writable } from 'svelte/store';
import { browser } from "$app/environment";

export const loggedIn = writable<boolean>(browser ? localStorage.loggedIn === 'true' : false);
export const accessToken = writable<string>(browser ? localStorage.accessToken || '' : '');
export const serverUrl = writable<string>(browser ? localStorage.serverURL || '' : '');
export const serverState = writable<string>(browser ? localStorage.serverState || '' : '');

if (browser) {
    loggedIn.subscribe(value => localStorage.loggedIn = String(value));
    accessToken.subscribe(value => localStorage.accessToken = value);
    serverUrl.subscribe(value => localStorage.serverURL = value);
    serverState.subscribe(value => localStorage.serverState = value);
}
