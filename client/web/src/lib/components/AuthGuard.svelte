<script lang="ts">
    import {page} from "$app/stores";
    import {fly} from "svelte/transition";
    import {loggedIn, serverUrl, serverState, accessToken} from "../../store";
    import {onMount} from "svelte";
    import {icons} from "../utils/fontAwesome";
    import {clickOutside} from "../utils/clickOutside";
    import AreaButton from "$lib/components/AreaButton.svelte";
    import Fa from "svelte-fa";
    import {goto} from '$app/navigation';
    import {browser} from '$app/environment';
    import ServerUrlPopup from "$lib/components/ServerUrlPopup.svelte";

    export let light = false;
    export let admin = false;

    let showDropdown = false;
    let showPopup = false;
    let userLoggedIn = undefined;
    let serverStateBuffer = undefined;
    let updateDropdown = () => {
        showDropdown = !showDropdown;
    };
    let updatePopup = () => {
        showPopup = !showPopup;
        if (browser) {
            document.body.style.overflow = showPopup ? "hidden" : "auto";
        }
    };
    let dropDownActions = {
        "Profile": () => {
            showDropdown = false;
            goto("/me");
        },
        "My actions": () => {
            showDropdown = false;
            goto(`/me/actions`);
        },
        "Logout": () => {
            showDropdown = false;
            loggedIn.set(false);
            accessToken.set("");
        }
    }

    onMount(() => {
        loggedIn.subscribe(value => {
            userLoggedIn = value;
        });
        serverState.subscribe(value => {
            serverStateBuffer = value;
        });
    })
</script>

<ServerUrlPopup on:close={updatePopup} show={showPopup} />
<section class="relative text-white flex justify-between items-center">
    <!-- Auth guard -->
    {#if userLoggedIn}
        {#if admin}
            <a href="/admin-console" class="cursor-pointer transition-all duration-150 flex justify-center items-center h-[40px] text-ui-blue hover:bg-ui-blue hover:bg-opacity-20 mr-5 rounded-lg px-3">
                <span>Console</span>
            </a>
        {/if}
        <AreaButton height="40" class="relative" animateOnHover={false} on:click={updatePopup}>
            <span class="font-bold text-sm px-3">{$serverUrl}</span>
            <span class="absolute top-0 right-0 flex h-3 w-3 -translate-y-[30%] translate-x-[30%]">
                {#if serverStateBuffer === "online"}<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>{/if}
                <span class="relative inline-flex rounded-full h-3 w-3 {serverStateBuffer === 'online' ? 'bg-green-500' : 'bg-red-500'}"></span>
            </span>
        </AreaButton>
        <AreaButton on:click={updateDropdown} width="40" height="40" class="ml-5">
            <Fa icon={icons.faUser}/>
        </AreaButton>
    {:else if userLoggedIn === false}
        <AreaButton redirectUrl="/login?redirect-url={$page.url.pathname}" width="100" height="40">
            <span class="font-bold">Login</span>
        </AreaButton>
        <AreaButton redirectUrl="/register" width="100" height="40" class="ml-5">
            <span class="font-bold">Register</span>
        </AreaButton>
    {/if}
    <!-- Dropdown -->
    {#if showDropdown}
        <div
                transition:fly={{duration: 150}}
                use:clickOutside
                on:click_outside={updateDropdown}
                class="z-50 absolute right-0 top-[63px] w-52 rounded-lg text-white overflow-hidden {light ? 'backdrop-blur-sm bg-white/30' : 'bg-area-button'}">
            {#each Object.entries(dropDownActions) as value, idx}
                <div
                        in:fly={{duration: 250, delay: idx * 50 + 80}}
                        on:click={value[1]}
                        class="select-none cursor-pointer flex justify-center items-center w-full h-11 hover:bg-area-blue transition-all duration-150">
                    <span class="font-white font-bold">{value[0]}</span>
                </div>
                {#if idx !== Object.entries(dropDownActions).length - 1}
                    <div class="w-full h-[1px] bg-white/20"></div>
                {/if}
            {/each}
        </div>
    {/if}
</section>
