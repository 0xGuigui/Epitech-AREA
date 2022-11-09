<script>
    import Header from "$lib/blocks/Header.svelte";

    export let data;
</script>

<div class="area-fade2">
    <Header light={true} admin={data.user} />
    <slot/>
</div>
