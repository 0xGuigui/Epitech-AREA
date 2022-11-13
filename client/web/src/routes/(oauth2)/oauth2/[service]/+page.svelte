<script lang="ts">
    import {icons} from "../../../../lib/utils/fontAwesome";
    import Fa from "svelte-fa";
    import {page} from '$app/stores';
    import {possibleIcons} from "../../../../lib/data/dynamicHeader";

    let service = $page.params.service;

    service = service.charAt(0).toUpperCase() + service.slice(1);
</script>

<section class="flex flex-col justify-center items-center relative bg-area-header w-screen h-screen">
    <a href="/" class="absolute top-4 left-4 flex justify-center items-center">
        <img src="/logo-area.png" alt="AREA logo" class="h-12"/>
        <span class="text-white text-3xl ml-3 font-bold">AREA</span>
    </a>
    <Fa icon={possibleIcons[service] || icons.faMarker} size="10x" color="#fff" />
    <div class="mt-8 text-5xl text-white font-bold">connected to <span class="area-letter">{$page.params.service}</span></div>
    <div class="text-white text-xl mt-2">(you can close this window)</div>
</section>
