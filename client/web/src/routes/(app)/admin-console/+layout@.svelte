<script>
    import Header from "$lib/blocks/Header.svelte";
    import Footer from "$lib/blocks/Footer.svelte";
</script>

<div class="bg-white">
    <Header light={false}/>
    <slot/>
    <Footer/>
</div>
