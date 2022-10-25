<script>
    import Layout from "./Layout.svelte";
    import { createEventDispatcher } from 'svelte';

    let email = '';
    let password = '';

    const dispatch = createEventDispatcher();

    function submit() {
        dispatch('submit', {
            email,
            password
        })
    }
</script>

<Layout header hideHeader headerHeight={56} let:scroller>
    <div slot="header">
        <div class="header" class:shadow={!!scroller.scroll}>
            AREA
        </div>
    </div>
    <div>
        {#each Array(100) as _, i}
            <div class="item">Row {i}</div>
        {/each}
    </div>
</Layout>

<form on:submit|preventDefault={submit} class='space-y-5 {$$props.class}'>
    <input id='email' name='email' type='email' bind:value={email} required />
    <input id='password' name='password' type='password' bind:value={password} required />
    <button type='submit'>Sign In</button>
</form>

<style>
    .header {
        background-color: #a20000;
        height: 56px;
        line-height: 56px;
        color: #FFFFFF;
        padding-left: 16px;
    }

    .shadow {
        box-shadow: 0px 2px 8px #00000088;
    }
</style>