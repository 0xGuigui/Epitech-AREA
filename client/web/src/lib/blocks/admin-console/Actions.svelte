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

    async function deleteActions(actionsData: object[]) {
        let promises = actionsData.map((actionData) => {
            return areaFetch("/actions/" + actionData["_id"], "DELETE");
        });

        await Promise.all(promises);
        await fetchActions();
    }

    async function executeActions(actionsData: object[]) {
        let promises = actionsData.map((actionData) => {
            return areaFetch("/actions/" + actionData["_id"] + "/execute", "POST");
        });

        await Promise.all(promises);
        await fetchActions();
    }

    function matchTriggeredAction(e) {
        actions.find((action) => {
            return action.name === e.detail.name;
        })?.action(e.detail.data);
    }

    const actions = [
        {
            name: "execute",
            icon: icons.faPlay,
            kind: "long",
            action: executeActions,
        },
        {
            name: "delete",
            icon: icons.faTrashAlt,
            action: deleteActions,
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
                kind="long"
                {actions}
                {page}
                on:actionTrigger={matchTriggeredAction}
                on:refresh={() => fetchActions(page)}
                on:pageChange={(e) => fetchActions(e.detail)}
        />
    {:catch error}
        <div class="w-screen h-screen flex justify-center items-center">
            An error occurred: {error.message}
        </div>
    {/await}
</section>
