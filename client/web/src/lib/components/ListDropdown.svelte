<script lang="ts">
    import Fa from "svelte-fa";
    import {icons} from "../utils/fontAwesome";
    import {fly} from "svelte/transition";
    import {clickOutside} from "../utils/clickOutside";
    import {createEventDispatcher} from "svelte";

    let show = false;
    export let actions = [];
    export let index = 0;
    const dispatch = createEventDispatcher();

    function updateShown() {
        if (show) return;
        show = true;
    }
</script>

<section
        on:click={updateShown}
        use:clickOutside
        on:click_outside={() => show = false}
        class="relative my-2 rounded-full w-10 cursor-pointer">
    <Fa icon={icons.faEllipsisV} size="1.35x" class="mx-auto" />
    {#if show}
        <div in:fly={{duration: 150}} class="z-10 absolute top-7 right-2 bg-white drop-shadow rounded-sm border-[1px] border-gray-200">
            {#each actions as action}
                <div on:click={() => {dispatch("message", {name: action.name, idx: index})}} class="min-w-[150px] flex items-center hover:bg-gray-200 py-1 px-3 transition-all duration-150">
                    <Fa icon={action.icon || icons.faArrowPointer} size={action.iconSize || "1x"} class="mr-4" />
                    <span class="text-lg text-left">{action.name}</span>
                </div>
            {/each}
        </div>
    {/if}
</section>
