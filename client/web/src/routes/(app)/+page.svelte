<script>
    import {areaFetch} from "$lib/utils/areaFetch";
    import {icons} from "$lib/utils/fontAwesome";
    import {goto} from "$app/navigation";
    import Fa from "svelte-fa";

    let services = getServices();
    let user = getUser();

    async function getUser() {
        const response = await areaFetch('/me')
        const json = await response.json()
        return {
            status: response.status,
            ...json
        };
    }

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
    {#await user}
        <div class="flex my-5 mx-5 text-white font-bold text-2xl">Welcome to AREA !</div>
        {:then user}
            <div class="flex my-5 mx-5 text-white font-bold text-2xl">Welcome to AREA {user.user.username} !</div>
    {/await}
    {#await services}
        <div class="flex justify-center items-center">
            <Fa icon={icons.faRefresh} size="5x"/>
        </div>
    {:then data}
        {#each data.services as service}
            <div on:click={() => goto(`/services/${service.name}`)}
                 style="background-color: {service.colorPalette.secondaryColor};"
                 class="inline-grid w-[300px] h-[200px] my-7 ml-16 font-bold text-white text-2xl flex shadow-2xl justify-center items-center backdrop-blur-sm bg-white/40 rounded-2xl hover:scale-110 transition-all duration-150 select-none cursor-pointer">
                <img src={"/" + service.name + ".png"} class="flex justify-center items-center h-20 w-20" alt="service"/>
                <div class="w-full h-full justify-center items-center flex"
                    >{service.name}
                </div>
            </div>
        {/each}
    {/await}
</section>