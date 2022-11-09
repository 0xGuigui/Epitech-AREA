import { writable } from 'svelte/store';
import { browser } from "$app/environment";

export const loggedIn = writable<boolean>(browser ? localStorage.loggedIn === 'true' : false);
export const accessToken = writable<string>(browser ? localStorage.accessToken : '');

if (browser) {
    loggedIn.subscribe(value => localStorage.loggedIn = String(value));
    accessToken.subscribe(value => localStorage.accessToken = value);
}
