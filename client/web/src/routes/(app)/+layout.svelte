<script>
    import Header from "$lib/blocks/Header.svelte";
    import Footer from "$lib/blocks/Footer.svelte";

    export let data;
</script>

<div class="area-fade2 max-w-screen overflow-x-hidden">
    <Header light={true} admin={data.user?.admin || false} />
    <slot/>
    <Footer />
</div>
