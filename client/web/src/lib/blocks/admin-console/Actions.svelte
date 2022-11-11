<script lang="ts">
    import {areaFetch} from "../../utils/areaFetch";
    import ListBuilder from "$lib/components/ListBuilder.svelte";
    import ActionViewer from "$lib/blocks/admin-console/viewers/ActionViewer.svelte";
    import {icons} from "../../utils/fontAwesome";

    const MAX_ELEMENTS = 10;
    let page = 1;

    async function fetchActions(newPage = page) {
        page = newPage
        let response = await areaFetch("/actions?page=" + page);
        actionsPromise = response.json();
    }

    async function deleteActions(userData: object) {
        console.log("delete actions", userData);
    }

    const actions = [
        {
            name: "delete",
            icon: icons.faTrashAlt,
            action: deleteActions
        },
    ];

    let actionsPromise = fetchActions();
</script>

<section>
    {#await actionsPromise}
        <div class="w-screen h-screen flex justify-center items-center">
            <img src="/loaders/ball-triangle.svg" alt="Loading svg">
        </div>
    {:then actionsData}
        <ListBuilder
                dataList={actionsData.actions}
                hasExtraData={actionsData.actions.length >= MAX_ELEMENTS}
                viewer={ActionViewer}
                {actions}
                {page}
                on:refresh={() => fetchActions(page)}
                on:pageChange={(e) => fetchActions(e.detail)}
        />
    {:catch error}
        <div class="w-screen h-screen flex justify-center items-center">
            An error occurred: {error.message}
        </div>
    {/await}
</section>
