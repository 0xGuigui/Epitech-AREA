<script lang="ts">
    import {page} from "$app/stores";
    import {fly} from "svelte/transition";
    import {clickOutside} from "../utils/clickOutside";
    import {createEventDispatcher} from "svelte";
    import {icons} from "../utils/fontAwesome";
    import Fa from "svelte-fa";
    import {loggedIn, serverUrl} from "../../store";
    import {goto} from '$app/navigation';

    export let show;

    const dispatch = createEventDispatcher();
    let serverUrlBuffer = $serverUrl;
    let serverUrlInputValue = serverUrlBuffer;

    let updateServerUrl = () => {
        if (serverUrlBuffer !== serverUrlInputValue) {
            serverUrl.set(serverUrlInputValue);
            loggedIn.set(false);
            dispatch("close");
            goto(`/login?redirect-url=${$page.url.pathname}`);
        }
    };

    let closePopup = (e = null) => {
        if (e && e.key && e.key !== "Escape") return;

        if (show === true) {
            dispatch('close')
            serverUrlInputValue = serverUrlBuffer
        }
    }
</script>

<svelte:window on:keydown|preventDefault={closePopup}/>

{#if show}
    <section
            transition:fly={{duration: 250}}
            class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 backdrop-blur bg-black/30">
        <div
                use:clickOutside
                on:click_outside={closePopup}
                class="relative w-[480px] h-[300px] rounded-lg flex flex-col justify-start pt-12 items-center bg-white">
            <!-- Close icon -->
            <div class="absolute top-0 right-0 py-1.5 px-3 cursor-pointer select-none hover:scale-125 transition-all duration-150"
                 on:click={closePopup}>
                <Fa icon={icons.faClose} size="2x"/>
            </div>
            <!-- Popup content -->
            <div class="w-[85%] font-bold text-3xl">
                Server URL:
            </div>
            <div class="flex w-[85%] pt-5">
                <div class="flex w-full ring-1 ring-gray-300 rounded-lg overflow-hidden">
                    <input bind:value={serverUrlInputValue} placeholder="enter server url" class="py-2.5 pl-4 w-full bg-transparent focus:outline-none">
                    <div on:click={updateServerUrl}
                            class="select-none transition-all duration-150 w-[180px] text-center {serverUrlInputValue === serverUrlBuffer ? 'bg-gray-300' : 'bg-ui-blue text-white cursor-pointer'} py-2.5 font-bold">Switch server</div>
                </div>
            </div>
        </div>
    </section>
{/if}
