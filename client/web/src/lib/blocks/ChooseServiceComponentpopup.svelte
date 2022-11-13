<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {fly} from "svelte/transition";
    import {icons} from "../utils/fontAwesome";
    import Fa from "svelte-fa";
    import {areaFetch} from "../utils/areaFetch";
    import {goto} from "$app/navigation";
    import FillServiceComponentDataPopup from "$lib/blocks/admin-console/FillServiceComponentDataPopup.svelte";

    export let context: any;
    export let kind: string;
    export let serviceName;

    let selectedComponent = {};
    let componentsPromise = getServiceComponents();
    let showPopup = false;

    async function getServiceComponents() {
        let apiEndpoint = `/services/${serviceName}/${kind}s`;
        console.log(apiEndpoint);
        let response = await areaFetch(apiEndpoint);

        componentsPromise = await response.json();
    }

    function updatePopup(component) {
        selectedComponent = component;
        showPopup = true;
    }

    const dispatch = createEventDispatcher();
</script>

<section class="w-full h-full overflow-y-scroll">
    {#if showPopup}
        <FillServiceComponentDataPopup />
    {:else}
        <div on:click={() => dispatch("close")} class="absolute top-3.5 left-5">
            <Fa icon={icons.faArrowLeft}
                class="text-2xl text-area-header cursor-pointer hover:scale-125 transition-all duration-150"
                size="2.5x"/>
        </div>
        <div class="font-bold text-3xl mt-10 text-area-header w-full text-center">Create a new {kind}:</div>
        <div class="w-full mt-10">
            {#await componentsPromise}
                <div>Loading...</div>
            {:then components}
                <div class="flex flex-wrap justify-around max-w-full mx-auto px-6">
                    {#each components[kind + "s"] as component}
                        {component.name}
                    {/each}
                </div>
            {/await}
        </div>
    {/if}
</section>
