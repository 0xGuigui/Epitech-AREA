import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const accessToken = writable(null as string | null);
