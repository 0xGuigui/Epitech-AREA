<script lang="ts">
    import {icons} from "$lib/utils/fontAwesome.js";
    import {createEventDispatcher} from "svelte";
    import Fa from "svelte-fa";

    export let component: any;
    export let service: any;
    export let kind: string;

    const dispatch = createEventDispatcher();
    let processing = false;
    let canCreate = true;
    let data = {};
    let inputArray = [];

    function submitData() {
        if (canCreate) {
            data[kind + "Type"] = service.name + "/" + component.name
            processing = true;
            dispatch("message", {
                component,
                service,
                data,
            })
        }
    }

    console.log(component)
</script>

<section class="overflow-scroll">
    <div on:click={() => dispatch("close")} class="absolute top-3.5 left-5">
        <Fa icon={icons.faArrowLeft}
            class="text-2xl text-area-header cursor-pointer hover:scale-125 transition-all duration-150"
            size="2.5x"/>
    </div>
    <div class="select-none font-bold text-3xl mt-10 text-white w-full text-center">{service.name} - {component.name}</div>
    <div on:click={submitData}
         class="{processing || !canCreate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'} select-none text-white font-bold text-2xl flex justify-center items-center absolute bottom-3.5 right-5 w-64 h-14 bg-[#695690] rounded-lg transition-all duration-150">
        {#if processing}
            <div class="animate-spinner">
                <Fa icon={icons.faRotate} size="1.5x"/>
            </div>
        {:else}
            Choose {kind}
        {/if}
    </div>
    <div class="w-full mt-16 mx-14">
        <span class="font-bold text-3xl text-white">Description: <span class="text-2xl font-semibold">{component.description}</span></span>
    </div>
    {#if component.fields}
        <div class="mx-14">
            <div class="mt-10 text-white font-bold text-3xl">
                Data:
            </div>
            <div class="flex flex-wrap items-start">
                {#each Object.entries(component.fields) as [key, value]}
                    {key} - {value}
                {/each}
            </div>
        </div>
    {:else}
        <div class="w-full h-full flex justify-center items-center w-full h-[400px]">
            <span class="font-bold text-white text-4xl">No data to enter, you're good to go !</span>
        </div>
    {/if}
</section>
