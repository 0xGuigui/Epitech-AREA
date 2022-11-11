<script lang="ts">
    import {areaFetch} from "../../utils/areaFetch";
    import ListBuilder from "$lib/components/ListBuilder.svelte";
    import ServiceViewer from "$lib/blocks/admin-console/viewers/ServiceViewer.svelte";

    async function fetchServices() {
        let response = await areaFetch("/services");
        servicesPromise = response.json();
    }

    let servicesPromise = fetchServices();
</script>

<section>
    {#await servicesPromise}
        <div class="w-screen h-screen flex justify-center items-center">
            <img src="/loaders/ball-triangle.svg" alt="Loading svg">
        </div>
    {:then services}
        <ListBuilder dataList={services.services} hasExtraData={false} viewer={ServiceViewer} />
    {:catch error}
        <div class="w-screen h-screen flex justify-center items-center">
            An error occurred: {error.message}
        </div>
    {/await}
</section>
