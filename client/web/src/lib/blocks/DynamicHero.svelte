<script lang="ts">
    import {scrollTo} from "svelte-scrolling";
    import Fa from "svelte-fa";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
    import {possibleIcons, possibleIconsLength} from "../data/dynamicHeader";
    import {icons} from "../utils/fontAwesome";

    function randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let innerWidth;
    let innerHeight;
    let show = false;
    let coordinates = [
        [40, 43],
        [23, 55],
        [80, 13],
        [55, 21],
        [35, 10],
        [20, 87],
        [37, 74],
        [20, 30],
        [60, 82],
        [82, 90],
        [58, 62],
        [64, 37],
    ]
    let iconsData = [
        icons.faSlack,
        icons.faGithub,
        icons.faTwitter,
        icons.faLinkedin,
        icons.faInstagram,
        icons.faFacebook,
        icons.faYoutube,
        icons.faPinterest,
        icons.faReddit,
        icons.faTwitch,
        icons.faSpotify,
        icons.faDiscord,
        icons.faDocker,
    ]

    iconsData = iconsData.sort(() => Math.random() - 0.5);

    onMount(() => {
        show = true;
    })
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<section class="relative flex flex-col justify-center items-center w-full h-screen bg-area-header overflow-hidden">
    {#if show}
        <div in:fade={{duration: 150, delay: 1700}} class="px-9 font-bold text-[200px] z-20 area-letter leading-none" style="font-family: 'Pacifico', cursive;">
            AREA
        </div>
        <div in:fade={{duration: 150, delay: 2000}} class="text-white text-5xl mt-10 z-10" style="font-family: 'Pacifico', cursive;">
            automate your workflow
        </div>
        <a href="#" in:fade={{duration: 150, delay: 2600}} use:scrollTo={{ref: 'pageBegin', duration: 850}} class="absolute bottom-1 left-1/2 -translate-x-1/2 mb-4 z-10">
            <div class="flex flex-col justify-center items-center hover:scale-110 transition-all">
                <div class="animate-bounce animation-controller"><Fa icon={icons.faAnglesDown} color="#eee" size="4x"/></div>
            </div>
        </a>
        {#each coordinates as coordinate, index}
            <div class="absolute" style="top: {coordinate[0]}%; left: {coordinate[1]}%; transform: translate(-50%, -50%);">
                <div in:fade={{duration: 550, delay: randomInRange(300, 1200)}}><Fa icon={iconsData[index]} size="2.7x" color="#576574" class="transition-all duration-150" /></div>
            </div>
        {/each}
    {/if}
</section>

<style>
    .animation-controller:hover {
        animation-play-state: paused;
    }
</style>
