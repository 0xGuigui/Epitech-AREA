<script>
    import {areaFetch} from "../../../../lib/utils/areaFetch";
    import {page} from "$app/stores";

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
        <p>waiting...</p>
    {:then data}
        {#each data.services as service}
            {#if service.name === $page.params.service}
                <div style="background-color: {service.colorPalette.mainColor};" class="h-[100vh] w-[100vw]"></div>
            {/if}
        {/each}
    {/await}
</section>