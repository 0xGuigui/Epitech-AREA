<script>
    import Header from "$lib/blocks/Header.svelte";
    import Footer from "$lib/blocks/Footer.svelte";
</script>

<Header light={false}/>
<div class="bg-white min-w-screen min-h-screen bg-white overflow-x-hidden pt-16">
    <slot/>
</div>
<Footer/>
