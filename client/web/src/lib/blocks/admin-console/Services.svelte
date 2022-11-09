<script lang="ts">
    import {areaFetch} from "../../utils/areaFetch";
    import ListBuilder from "$lib/components/ListBuilder.svelte";

    let fetchServices = async () => {
        let response = await areaFetch("/services");
        servicesPromise = response.json();
    };

    let servicesPromise = fetchServices();
</script>

<section>
    {#await servicesPromise}
        <p>loading...</p>
    {:then services}
        <ListBuilder list={services.services} />
    {:catch error}
        <p>error</p>
    {/await}
</section>
