<script>
    import Header from "$lib/blocks/Header.svelte";
    import Footer from "$lib/blocks/Footer.svelte";

    export let data;

    let admin = data.user?.admin;

    $: if (admin) {
    	admin = data.user?.admin;
    }
</script>

<Header light={true} {admin} />
<div class="area-fade2 min-w-screen min-h-screen overflow-x-hidden">
    <slot/>
</div>
<Footer />
