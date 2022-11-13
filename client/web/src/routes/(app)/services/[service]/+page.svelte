<script>
    import {areaFetch} from "../../../../lib/utils/areaFetch";
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";

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

<section>
    {#await services}
        <p></p>
    {:then data}
        {#each data.services as service}
            {#if service.name === $page.params.service}
                <div style="background-color: {service.colorPalette.mainColor};" class="flex flex-col justify-end items-center h-[100vh] w-[100vw]">
                    <button class="absolute h-8 w-32 right-16 top-24 outline outline-offset-8 outline-4 backdrop-blur-sm white/50 text-xl text-white font-bold rounded-full hover:scale-110 transition-all duration-150 select-none cursor-pointer" type="submit"
                            on:click={() => goto(service.colorPalette.urlSite)}>Visit {service.name}</button>
                    <button class="absolute h-8 w-32 left-16 top-24 outline outline-offset-8 outline-4 backdrop-blur-sm white/50 text-xl text-white font-bold rounded-full hover:scale-110 transition-all duration-150 select-none cursor-pointer" type="submit"
                            on:click={() => goto(`/`)}>{"< Back"}</button>
                    <div class="flex flex-col justify-center items-center">
                        <h1 class="text-6xl text-white font-bold">{service.name}</h1>
                        <p class="my-7 max-w-[600px] text-xl text-center text-white font-semibold">{service.description}</p>
                        <button class="mb-72 my-7 py-3 px-5 flex block justify-center items-center bg-white text-2xl text-area-header font-bold rounded-full hover:bg-gray-300 hover:scale-110 transition-all duration-150 select-none cursor-pointer shadow-md" type="submit"
                                on:click={() => goto(`/me/actions`)}>Create {service.name} action</button>
                    </div>
                </div>
            {/if}
        {/each}
    {/await}
</section>