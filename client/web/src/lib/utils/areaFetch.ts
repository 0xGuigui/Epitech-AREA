import {accessToken, loggedIn, serverState} from "../../store";

function buildRequestFactory(url: string, method: string, body: object | null, token: string | null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (body) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config["body"] = JSON.stringify(body)
    }
    if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return {
        fetch: () => fetch(url, config),
    }
}

export async function refreshAccessToken(serverUrl: string): Promise<boolean> {
    const request = buildRequestFactory(serverUrl + '/refresh', 'POST', {
        jwt: localStorage.getItem('refreshToken') || '',
    }, null)
    const response = await request.fetch()

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
        let request = buildRequestFactory(serverUrl + url, method, body, token);
        let response = await request.fetch();

        serverState.set("online");
        if (response.status === 401) {
            if (await refreshAccessToken(serverUrl)) {
                const newToken = localStorage.getItem("accessToken");
                request = buildRequestFactory(serverUrl + url, method, body, newToken);
                response = await request.fetch();

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }
                return response;
            }
            throw new Error("Unauthorized");
        }
        return response;
    } catch (e) {
        serverState.set("error");
    }
}
