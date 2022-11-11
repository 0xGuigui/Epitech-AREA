<script lang="ts">
    import Fa from "svelte-fa";
    import {icons} from "../utils/fontAwesome";
    import {fly} from "svelte/transition";
    import {clickOutside} from "../utils/clickOutside";
    import {createEventDispatcher} from "svelte";

    let show = false;
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
        <div transition:fly={{duration: 150}} class="z-10 absolute top-7 right-3.5 w-10 h-10 bg-red-600 rounded-sm">

        </div>
    {/if}
</section>
