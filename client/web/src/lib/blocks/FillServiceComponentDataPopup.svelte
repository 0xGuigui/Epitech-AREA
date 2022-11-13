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
</script>

<section class="w-full h-full overflow-y-scroll">
    <div on:click={() => dispatch("close")} class="absolute top-3.5 left-5">
        <Fa icon={icons.faArrowLeft}
            class="text-2xl text-area-header cursor-pointer hover:scale-125 transition-all duration-150"
            size="2.5x"/>
    </div>
    <div class="select-none font-bold text-3xl mt-10 text-white w-full text-center">{service.name}: {component.name}</div>
    <div on:click={submitData}
         class="{processing || !canCreate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'} select-none text-white font-bold text-2xl flex justify-center items-center absolute bottom-3.5 right-5 w-64 h-14 bg-[#695690] rounded-lg transition-all duration-150">
        {#if processing}
            <div class="animate-spinner">
                <Fa icon={icons.faRotate} size="1.5x"/>
            </div>
        {:else}
            Create action
        {/if}
    </div>
</section>
