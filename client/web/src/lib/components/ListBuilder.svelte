<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {fade} from "svelte/transition";
    import ListCheckBox from "$lib/components/ListCheckBox.svelte";

    export let dataList = [];
    export let viewer;
    export let hasExtraData = false;
    export let actions;

    const dispatch = createEventDispatcher();
    let page = 1;
    let loading = false;
    let selected = [];
    let allSelected = false;

    function extendDataList() {
        loading = true;
        page++;
        dispatch("extendDataList", {page: page});
    }

    function wrapDataList() {
        let newSelected = new Array(dataList.length).fill(false);

        for (let i = 0; i < newSelected.length; i++) {
            newSelected[i] = selected[i] || false;
        }
        selected = newSelected;
    }

    function updateSelectState(newState: boolean) {
        console.log("updateSelectState", newState);
        selected = selected.fill(newState);
    }

    $: dataList, loading = false, wrapDataList();
</script>

<section class="w-full">
    <div class="relative h-14 w-full flex justify-center items-center drop-shadow-sm shadow shadow-gray-300 border-b border-gray-300 px-6">
        <div>test1</div>
        <div>test2</div>
        <div>test3</div>
        <div class="flex justify-center items-center h-full absolute top-0 left-0 ml-3.5">
            {#if selected.filter((e) => e).length > 0}
                <div on:click={() => updateSelectState(false)}>remove selection</div>
            {/if}
        </div>
    </div>
    <div class="border border-gray-400 max-w-[900px] mx-auto rounded-sm mt-10">
        <!-- Header (searching and global selection) -->
        <div class="bg-gray-200 flex border-b border-gray-400">
            <div class="flex-1">
                <ListCheckBox selected={allSelected} on:select={(e) => updateSelectState(e.detail)}/>
            </div>
            <div class="flex-1">
                <input placeholder="search element" class="px-3 w-full h-full">
            </div>
            <div class="flex-1">

            </div>
        </div>
        {#each dataList as item, idx}
            <div class="border-b flex justify-center items-center transition-all duration-150 border-gray-400"
                    transition:fade={{duration: 150}}>
                <ListCheckBox selected={selected[idx]}/>
                <svelte:component this={viewer} data={item}/>
            </div>
        {/each}
        <!-- Footer (navigation) -->
        <div class="flex justify-end items-center bg-gray-200 flex">
            <div class="mx-2">
                test
            </div>
            <div class="mx-2">
                prev
            </div>
            <div class="mx-2">
                next
            </div>
        </div>
    </div>
</section>
