<script lang="ts">
    import {icons} from "$lib/utils/fontAwesome";
    import Fa from "svelte-fa";
    import {page} from '$app/stores';
    import {possibleIcons} from "$lib/data/dynamicHeader";
    import config from '$lib/data/config'
    import {accessToken, loggedIn, serverUrl} from "../../../../store";
    import {areaFetch} from "$lib/utils/areaFetch";
    import {browser} from '$app/environment'

    async function loginDiscord(code) {
        const response = await fetch(`${$serverUrl || config.defaultServerUrl}/login/Discord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                redirect_uri: config.Oauth2.Discord.redirect_uri
            })
        })
        const json = await response.json()
        if (response.status === 200) {
            if (browser) {
                loggedIn.set(true)
                accessToken.set(json.token)
                localStorage.setItem("refreshToken", json.refreshToken);
            }
        }
    }

    async function stuff(code) {
        const res = await areaFetch(`/oauth2/${service}`, 'POST', {"code": code, "redirect_uri": config.Oauth2[service].redirect_uri})
    }

    let service = $page.params.service;
    const code = $page.url.searchParams.get('code')

    if (browser) {
        if (localStorage.getItem('discord_login') === "true") {
            loginDiscord(code)
            localStorage.removeItem('discord_login')
        } else
            stuff(code)
    }

    service = service.charAt(0).toUpperCase() + service.slice(1);
</script>

<section class="flex flex-col justify-center items-center relative bg-area-header w-screen h-screen">
    <a href="/" class="absolute top-4 left-4 flex justify-center items-center">
        <img src="/logo-area.png" alt="AREA logo" class="h-12"/>
        <span class="text-white text-3xl ml-3 font-bold">AREA</span>
    </a>
    <Fa icon={possibleIcons[service] || icons.faMarker} size="10x" color="#fff" />
    <div class="mt-8 text-5xl text-white font-bold">Connected to <span class="area-letter">{$page.params.service}</span></div>
    <div class="text-white text-xl mt-2">(you can close this window)</div>
</section>
