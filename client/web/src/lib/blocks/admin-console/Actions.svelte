<script lang="ts">
    import {areaFetch} from "../../utils/areaFetch";
    import ListBuilder from "$lib/components/ListBuilder.svelte";
    import ActionViewer from "$lib/blocks/admin-console/viewers/ActionViewer.svelte";

    async function fetchActions() {
        let response = await areaFetch("/actions");
        actionsPromise = response.json();
    }

    let actionsPromise = fetchActions();
</script>

<section>
    {#await actionsPromise}
        <div class="w-screen h-screen flex justify-center items-center">
            <img src="/loaders/ball-triangle.svg" alt="Loading svg">
        </div>
    {:then actions}
        <ListBuilder dataList={actions.actions} hasExtraData={false} viewer={ActionViewer} />
    {:catch error}
        <div class="w-screen h-screen flex justify-center items-center">
            An error occurred: {error.message}
        </div>
    {/await}
</section>
