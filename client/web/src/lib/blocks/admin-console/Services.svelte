<script lang="ts">
    import {areaFetch} from "../../utils/areaFetch";
    import ListBuilder from "$lib/components/ListBuilder.svelte";
    import ServiceViewer from "$lib/blocks/admin-console/viewers/ServiceViewer.svelte";
    import {icons} from "../../utils/fontAwesome";

    async function fetchServices() {
        let response = await areaFetch("/services");
        servicesPromise = response.json();
    }

    async function disableServices(servicesData) {
        let promises = servicesData.map(service => {
            return areaFetch(`/services/${service.name}/update-state`, "POST", {
                state: "false",
            });
        });
        await Promise.all(promises);
        await fetchServices();
    }

    async function enableServices(data) {
        let promises = data.map(service => {
            return areaFetch(`/services/${service.name}/update-state`, "POST", {
                state: "true",
            });
        });
        await Promise.all(promises);
        await fetchServices();
    }

    const actions = [
        {
            name: "disable",
            icon: icons.faBan,
            action: disableServices,
        },
        {
            name: "enable",
            icon: icons.faCheck,
            action: enableServices,
        }
    ];

    function matchTriggeredAction(e) {
        actions.find((action) => {
            return action.name === e.detail.name;
        })?.action(e.detail.data);
    }

    let servicesPromise = fetchServices();
</script>

<section>
    {#await servicesPromise}
        <div class="w-screen h-screen flex justify-center items-center">
            <img src="/loaders/ball-triangle.svg" alt="Loading svg">
        </div>
    {:then services}
        <ListBuilder
                dataList={services.services}
                hasExtraData={false}
                viewer={ServiceViewer}
                on:refresh={fetchServices}
                on:actionTrigger={matchTriggeredAction}
                {actions}
        />
    {:catch error}
        <div class="w-screen h-screen flex justify-center items-center">
            An error occurred: {error.message}
        </div>
    {/await}
</section>
