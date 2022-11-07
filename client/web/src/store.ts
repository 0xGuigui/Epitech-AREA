import { writable } from 'svelte/store';
import { browser } from "$app/environment";

export let loggedIn = writable(false);
export const accessToken = writable(null as string | null);

if (browser) {
    loggedIn.update(n => Boolean(localStorage.getItem('loggedIn')) || false)
    loggedIn.subscribe(value => {
        localStorage.setItem("loggedIn", value.toString());
    });
}