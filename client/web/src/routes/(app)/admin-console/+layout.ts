/** @type {import('./$types').PageLoad} */
import {areaFetch} from "$lib/utils/areaFetch";

export const ssr = false;

export async function load() {
    if (localStorage.getItem('loggedIn') === "true") {
        const response = await areaFetch('/me');

        if (response.status === 200) {
            const user = await response.json();
            return {
                user: user.user
            };
        }
    }

    return {};
}
