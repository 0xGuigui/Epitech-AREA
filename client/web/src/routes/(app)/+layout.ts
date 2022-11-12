/** @type {import('./$types').PageLoad} */
import {areaFetch} from "../../lib/utils/areaFetch";

export const ssr = false;

export async function load() {
    if (localStorage.getItem('loggedIn') === "true") {
        let response;

        try {
            response = await areaFetch('/me');

            if (response.status === 200) {
                localStorage.setItem('serverState', "error");
                const user = await response.json();
                return {
                    user: user.user
                };
            }
        } catch (e) {
            localStorage.setItem('serverState', "error");
        }
    }
    return {};
}
