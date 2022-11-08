<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let height: number;
    export let width: number;
    export let redirectUrl: string;

    let dispatcher = createEventDispatcher();
    let styleString = `${height ? `height: ${height}px;` : ''} ${width ? `width: ${width}px;` : ''}`;
</script>

<section style={styleString} class="flex justify-center items-center select-none cursor-pointer bg-area-button hover:bg-area-blue hover:scale-110 transition-all duration-150 rounded-lg {$$props.class}" on:click={() => {dispatcher("click")}}>
    {#if redirectUrl}
        <a href={redirectUrl}>
            <slot/>
        </a>
    {:else}
        <slot/>
    {/if}
</section>
