<script>
    import {areaFetch} from "../../lib/utils/areaFetch";
    import {icons} from "../../lib/utils/fontAwesome";
    import {goto} from "$app/navigation";
    import Fa from "svelte-fa";

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

<section class="h-[100vh] w-[100vw]">
    {#await services}
        <div class="flex justify-center items-center">
            <Fa icon={icons.faRefresh} size="5x"/>
        </div>
    {:then data}
        {#each data.services as service}
            <div on:click={() => {
                 goto(`/services/${service.name}`);
                 }}
                 class="inline-grid w-[300px] h-[200px] my-7 ml-16 font-bold flex shadow-2xl justify-center items-center backdrop-blur-sm bg-white/60 rounded-2xl hover:scale-110 transition-all duration-150 select-none cursor-pointer">
                <div class="w-full h-full justify-center items-center flex"
                    >{service.name} - {service.description}
                </div>
            </div>
        {/each}
    {/await}
</section>