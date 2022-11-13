<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {icons} from "../utils/fontAwesome";
    import Fa from "svelte-fa";
    import {areaFetch} from "../utils/areaFetch";
    import ChooseServiceComponentPopup from "$lib/blocks/ChooseServiceComponentpopup.svelte";

    export let context: any;
    export let kind: string;

    const dispatch = createEventDispatcher();
    let servicesPromise = getServices();
    let selectedservice = undefined;
    let showPopup = false;

    async function getServices() {
        let response = await areaFetch('/services');

        servicesPromise = await response.json();
    }

    function updatePopup(service = undefined) {
        selectedservice = service;
        showPopup = !showPopup;
    }

    function transmitEvent(e) {
        dispatch(e.type, e.detail);
    }
</script>

<section class="w-full h-full overflow-y-scroll">
    {#if showPopup}
        <ChooseServiceComponentPopup
                {context}
                service={selectedservice}
                {kind}
                on:close={updatePopup}
                on:message={transmitEvent}
        />
    {:else}
        <div on:click={() => dispatch("close")} class="absolute top-3.5 left-5">
            <Fa icon={icons.faArrowLeft}
                class="text-2xl text-area-header cursor-pointer hover:scale-125 transition-all duration-150"
                size="2.5x"/>
        </div>
        <div class="select-none font-bold text-3xl mt-10 text-area-header w-full text-center">Create a new {kind}:</div>
        <div class="w-full mt-10">
            {#await servicesPromise}
                <div></div>
            {:then services}
                <div class="flex flex-wrap justify-around max-w-full mx-auto px-6">
                    {#each services.services as service}
                        {#if service[kind + "s"].length > 0}
                            <div on:click={() => updatePopup(service)}
                                 style="background-color: {service.colorPalette.secondaryColor};"
                                 class="inline-grid w-[300px] mx-5 h-[200px] my-7 font-bold text-white text-2xl flex shadow-2xl justify-center items-center backdrop-blur-sm bg-white/40 rounded-2xl hover:scale-110 transition-all duration-150 select-none cursor-pointer">
                                <img src={"/" + service.name + ".png"} onerror="this.onerror=null;this.src='/logo-area.png'"
                                     alt="service" class="w-20 mx-auto"/>
                                <div class="w-full h-full justify-center items-center flex">
                                    {service.name}
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/await}
        </div>
    {/if}
</section>
