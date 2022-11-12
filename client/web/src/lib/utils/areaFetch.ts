import {accessToken, loggedIn, serverState} from "../../store";

function buildRequest(url: string, method: string, body: object | null, token: string | null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (body) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config["body"] = JSON.stringify(body);
    }
    if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(url, config);
}

export async function refreshAccessToken(serverUrl: string): Promise<boolean> {
    const response = await buildRequest(serverUrl + '/refresh', 'POST', {
        jwt: localStorage.getItem('refreshToken') || '',
    }, null)

    if (response.status === 200) {
        const data = await response.json()
        accessToken.set(data.token)
        return true;
    }
    loggedIn.set(false)
    return false;
}

export async function areaFetch(url: string, method = "GET", body = null): Promise<any> {
    const token = localStorage.getItem("accessToken");
    const serverUrl = localStorage.getItem("serverURL");

    if (!token || !serverUrl) {
        throw new Error("No token or serverUrl");
    }
    try {
        let response = await buildRequest(serverUrl + url, method, body, token);

        if (response.status === 401) {
            if (await refreshAccessToken(serverUrl)) {
                const newToken = localStorage.getItem("accessToken");
                response = await buildRequest(serverUrl + url, method, body, newToken);

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }
            }
        }
        if (response.status === 200) {
            serverState.set("online");
        }
        return response;
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            serverState.set("offline");
        }
        throw e;
    }
}
