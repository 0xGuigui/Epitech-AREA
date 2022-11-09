<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let height: number;
    export let width: number;
    export let redirectUrl: string;
    export let animateOnHover = true;

    let dispatcher = createEventDispatcher();
    let styleString = `${height ? `height: ${height}px;` : ''} ${width ? `width: ${width}px;` : ''}`;
</script>

<section
        class:hover:bg-area-blue={animateOnHover}
        class:hover:scale-110={animateOnHover}
        style={styleString} class="flex justify-center items-center select-none cursor-pointer bg-area-button transition-all duration-150 rounded-lg {$$props.class}" on:click={() => {dispatcher("click")}}>
    {#if redirectUrl}
        <a href={redirectUrl} class="h-full w-full flex justify-center items-center">
            <slot/>
        </a>
    {:else}
        <slot/>
    {/if}
</section>
