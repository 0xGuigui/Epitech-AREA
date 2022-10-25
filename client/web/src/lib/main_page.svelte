<Layout header hideHeader headerHeight={56} let:scroller>
    <div slot="header">
        <div class="header" class:shadow={!!scroller.scroll}>
            Page title
        </div>
    </div>

    <div>
        {#each Array(100) as _, i}
            <div class="item">Row {i}</div>
        {/each}
    </div>
</Layout>

<script>
    import Layout from "./Layout.svelte";
</script>

<style>
    .header {
        background-color: #FF0000;
        height: 56px;
        line-height: 56px;
        color: #FFFFFF;
        padding-left: 16px;
    }

    .shadow {
        box-shadow: 0px 2px 8px #00000088;
    }
</style>