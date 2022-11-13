<script>
    import {areaFetch} from "$lib/utils/areaFetch";
    import {icons} from "$lib/utils/fontAwesome";
    import {goto} from "$app/navigation";
    import Fa from "svelte-fa";
    import DynamicHero from "$lib/blocks/DynamicHero.svelte";
    import {scrollRef} from "svelte-scrolling";

    export let data;
    let services = getServices();

    async function getServices() {
        const response = await areaFetch('/services')
        const json = await response.json()
        return {
            status: response.status,
            ...json
        };
    }
</script>

<section>
    <DynamicHero/>
    <!-- page begin anchor -->
    <div use:scrollRef={'pageBegin'}></div>
    <div>Welcome to AREA{data.user ? ", " + data.user.username : ""} !</div>
    {#await services}
        <div class="flex justify-center items-center">
            <p></p>
        </div>
    {:then data}
        {#each data.services as service}
            <div on:click={() => goto(`/services/${service.name}`)}
                 style="background-color: {service.colorPalette.secondaryColor};"
                 class="inline-grid w-[300px] h-[200px] my-7 ml-16 font-bold text-white text-2xl flex shadow-2xl justify-center items-center backdrop-blur-sm bg-white/40 rounded-2xl hover:scale-110 transition-all duration-300 select-none cursor-pointer">
                <img src={"/" + service.name + ".png"} onerror="this.onerror=null;this.src='/logo-area.png'"
                     class="flex justify-center items-center h-20 w-20" alt="service"/>
                <div class="w-full h-full justify-center items-center flex"
                >{service.name}
                </div>
            </div>
        {/each}
    {/await}
</section>