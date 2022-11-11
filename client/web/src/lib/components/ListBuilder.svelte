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
    export let actions;

    const dispatch = createEventDispatcher();
    let selected = [];
    let allSelected = false;
    let selectedListState = "deselected";
    let page = 1;

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

    $: dataList, onDataListChange();
</script>

<section class="w-full">
    <div
            class:bg-ui-blue={selectedListState !== "deselected"}
            class="transition-all duration-150 bg-opacity-10 relative h-14 w-full flex justify-center items-center drop-shadow-sm shadow shadow-gray-300 border-b border-gray-300 px-6">
        <div>test</div>
        <div class="flex justify-center items-center h-full absolute top-0 left-0 ml-3.5">
            {#if selectedListState !== "deselected"}
                <div on:click={() => updateAllSelectedElement(false)}
                     class="flex items-center select-none cursor-pointer rounded-lg transition-all duration-150 hover:bg-ui-blue hover:bg-opacity-20 px-3 py-1.5">
                    <Fa icon={icons.faClose} size="1.5x" color="rgb(26,115,232)"/>
                    <span class="text-ui-blue ml-2 font-semibold text-lg mb-0.5">remove selection</span>
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
                <div class="flex-1">
                    <input placeholder="search element" class="px-3 py-1 w-full">
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
                    <ListDropdown/>
                </div>
            {/each}
        {:else}
            <div class="border-b flex justify-center items-center border-gray-400 min-h-[400px]">
                <span>Nothing to show there !</span>
            </div>
        {/if}
        <!-- Footer (navigation) -->
        <div class="flex justify-end items-center bg-gray-100 flex h-12">
            <div class="mr-5">
                test
            </div>
            <div class="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 {page <= 1 ? '' : 'hover:bg-ui-blue hover:bg-opacity-20'}">
                <Fa icon={icons.faChevronLeft} size="1.25x" color={page <= 1 ? '#b2bec3' : 'black'}/>
            </div>
            <div class="flex items-center justify-center w-9 h-9 mr-4 rounded-full transition-all duration-150 {hasExtraData ? 'hover:bg-ui-blue hover:bg-opacity-20' : ''}">
                <Fa icon={icons.faChevronRight} size="1.25x" color={hasExtraData ? 'black' : '#b2bec3'}/>
            </div>
        </div>
    </div>
</section>
