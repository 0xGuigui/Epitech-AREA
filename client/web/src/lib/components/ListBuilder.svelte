<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {fade} from "svelte/transition";
    import ListCheckBox from "$lib/components/ListCheckBox.svelte";
    import Fa from "svelte-fa";
    import {icons} from "../utils/fontAwesome";
    import ListDropdown from "$lib/components/ListDropdown.svelte";

    export let dataList = [];
    export let viewer;
    export let hasExtraData = false;
    export let actions = [];
    export let page = 1;

    const dispatch = createEventDispatcher();
    let selected = [];
    let selectedListState = "deselected";
    let searchBarFocused = false;

    function computeListSelectedState() {
        const selectedCount = selected.filter((item) => item).length;

        if (selectedCount === 0) {
            selectedListState = "deselected";
        } else if (selectedCount === dataList.length) {
            selectedListState = "selected";
        } else {
            selectedListState = "partial";
        }
    }

    function updateAllSelectedElement(value: boolean) {
        for (let i = 0; i < selected.length; i++) {
            selected[i] = value;
        }
        selectedListState = value ? "selected" : "deselected";
    }

    function selectElement(idx: number) {
        selected[idx] = !selected[idx];
        computeListSelectedState();
    }

    function onDataListChange() {
        selected = new Array(dataList.length).fill(false);
        selectedListState = "deselected";
    }

    function handleActionTrigger(actionName) {
        let event = {
            page: page,
            name: actionName,
            data: selected.map((item, idx) => item ? dataList[idx] : null).filter((item) => item)
        }
        updateAllSelectedElement(false);
        dispatch("actionTrigger", event);
    }

    function handlePageChange(direction: "prev" | "next") {
        if ((direction === "prev" && page <= 1) || (direction === "next" && dataList.length < 10)) {
            return;
        }
        if (direction === "prev") {
            dispatch("pageChange", page - 1);
        } else {
            dispatch("pageChange", page + 1);
        }
    }

    function transmitEvent(e) {
        dispatch("actionTrigger", {
            name: e.detail.name,
            data: [dataList[e.detail.idx]]
        });
    }

    function handleKeyPressed(e) {
        if (e.key === "Escape") {
            updateAllSelectedElement(false);
        }
    }

    $: dataList, onDataListChange();
</script>

<svelte:window on:keydown|preventDefault={handleKeyPressed} />

<section class="w-full">
    <div
            class:bg-ui-blue={selectedListState !== "deselected"}
            class="transition-all duration-150 bg-opacity-10 relative h-14 w-full flex justify-center items-center drop-shadow-sm shadow shadow-gray-300 border-b border-gray-300 px-6">
        <div
                on:click={() => dispatch("refresh")}
                class="min-w-[100px] flex items-center select-none rounded-lg transition-all duration-150 cursor-pointer hover:bg-ui-blue hover:bg-opacity-20 px-3 mx-1.5 py-1.5">
            <Fa icon={icons.faRefresh} size="1x" color='rgb(26,115,232)'/>
            <span class="text-ui-blue ml-2 text-lg mb-0.5">refresh</span>
        </div>
        {#each actions as action}
            <div on:click={() => handleActionTrigger(action.name)}
                 class="min-w-[100px] mx-1.5 flex items-center justify-center select-none rounded-lg transition-all duration-150 {selectedListState !== 'deselected' ? 'cursor-pointer hover:bg-ui-blue hover:bg-opacity-20' : 'opacity-50'} px-3 py-1.5">
                <Fa icon={action.icon || icons.faArrowPointer} size={action.iconSize || "1x"}
                    color={selectedListState !== 'deselected' ? 'rgb(26,115,232)' : 'rgb(156, 163, 175)'}/>
                <span class="{selectedListState !== 'deselected' ? 'text-ui-blue' : 'text-[rgb(156, 163, 175)]'} ml-2 text-lg mb-0.5">{action.name}</span>
            </div>
        {/each}
        <div class="flex justify-center items-center h-full absolute top-0 left-0 ml-3.5">
            {#if selectedListState !== "deselected"}
                <div on:click={() => updateAllSelectedElement(false)}
                     class="flex items-center select-none cursor-pointer rounded-lg transition-all duration-150 hover:bg-ui-blue hover:bg-opacity-20 px-3 py-1.5">
                    <Fa icon={icons.faClose} size="1.5x" color="rgb(26,115,232)"/>
                    <span class="text-ui-blue ml-2 font-light text-lg mb-0.5">remove selection</span>
                </div>
            {/if}
        </div>
    </div>
    <div class="border border-gray-400 max-w-[900px] mx-auto rounded-sm mt-10">
        <!-- Header (searching and global selection) -->
        <div class="bg-gray-100 flex items-center border-b border-gray-400 h-12">
            {#if dataList.length > 0}
                <div class="flex-1">
                    <ListCheckBox selected={selectedListState === "selected"}
                                  on:select={(e) => updateAllSelectedElement(e.detail)}/>
                </div>
                <div class="flex-1 ring-2 rounded-sm overflow-hidden transition-all duration-100 {searchBarFocused ? 'ring-ui-blue' : 'ring-black'}">
                    <input on:focus={() => searchBarFocused = true} on:blur={() => searchBarFocused = false} placeholder="search element" class="px-3 py-1 w-full focus:outline-none">
                </div>
                <div class="flex-1">

                </div>
            {/if}
        </div>
        {#if dataList.length > 0}
            {#each dataList as item, idx}
                <div class="border-b flex justify-center items-center transition-all duration-150 border-gray-400"
                     in:fade={{duration: 150}}>
                    <ListCheckBox selected={selected[idx]} on:select={(e) => {selectElement(idx)}}/>
                    <svelte:component this={viewer} data={item}/>
                    <ListDropdown {actions} on:message={transmitEvent} index={idx} />
                </div>
            {/each}
        {:else}
            <div class="border-b flex justify-center items-center border-gray-400 min-h-[400px]">
                <span>Nothing to show there !</span>
            </div>
        {/if}
        <!-- Footer (navigation) -->
        <div class="flex justify-end items-center bg-gray-100 flex h-12">
            <div class="mr-3 text-sm">
                <span>page: {page}</span>
            </div>
            <div
                    on:click={() => handlePageChange("prev")}
                    class="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 {page <= 1 ? '' : 'hover:bg-ui-blue hover:bg-opacity-20'}">
                <Fa icon={icons.faChevronLeft} size="1.25x" color={page <= 1 ? '#b2bec3' : 'black'}/>
            </div>
            <div
                    on:click={() => handlePageChange("next")}
                    class="flex items-center justify-center w-9 h-9 mr-4 rounded-full transition-all duration-150 {hasExtraData ? 'hover:bg-ui-blue hover:bg-opacity-20' : ''}">
                <Fa icon={icons.faChevronRight} size="1.25x" color={hasExtraData ? 'black' : '#b2bec3'}/>
            </div>
        </div>
    </div>
</section>
