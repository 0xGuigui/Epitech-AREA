/** @type {import('./$types').PageLoad} */
import {areaFetch} from "../../lib/utils/areaFetch";
import {browser} from "$app/environment";

export async function load() {
    if (browser && localStorage.getItem('loggedIn') === "true") {
        const response = await areaFetch('/me');

        if (response.status === 200) {
            const user = await response.json();
            return {
                user: user.user
            };
        }
    }
}
