import {serverUrl} from "../../store";

export function refreshAccessToken():boolean {
    return true;
}

export async function areaFetch(url: string, method = "GET", body = null, depth = 0): Promise<any> {
    const token = localStorage.getItem("accessToken") || 'dummy'

    const response = await fetch(url, {
        method,
        body,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (response.status === 401 && depth === 0 && refreshAccessToken()) {
        return areaFetch(url, method, body, depth + 1)
    }
    return response.json()
}
