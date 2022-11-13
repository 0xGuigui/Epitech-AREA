<script>
    import {goto} from "$app/navigation";
    import Fa from "svelte-fa";
    import DynamicHero from "$lib/blocks/DynamicHero.svelte";
    import {scrollRef} from "svelte-scrolling";
    import {loggedIn, serverUrl} from "../../store";
    import config from "$lib/data/config";
    import {onDestroy} from "svelte";
    import {icons} from "$lib/utils/fontAwesome";

    export let data;
    let services = getServices();
    let logged = $loggedIn;

    async function getServices() {
        const response = await fetch(($serverUrl || config.defaultServerUrl) + "/about.json");
        const json = await response.json()
        return {
            status: response.status,
            ...json
        };
    }

    const unsubscribe = loggedIn.subscribe(value => {
        logged = value;
    });

    services.then((data) => {
        console.log(data);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<section>
    <DynamicHero/>
    <!-- page begin anchor -->
    <div use:scrollRef={'pageBegin'}></div>
    <div class="min-h-screen pb-44">
        <div class="text-6xl text-center text-white pt-24 transition-all" style="font-family: 'Pacifico', cursive;">Welcome to area{data.user && logged ? ", " + data.user.username : ""} !</div>
        <div class="mt-20 pb-2 mx-16 text-xl text-white leading-tight font-bold">Area provide a huge amount of services to let you change your life as you want.<br/> From Discord to Spotify, create a real automatisation pipeline and play with your most favorite services !</div>
        {#await services}
            <div class="flex justify-center items-center">
                <p></p>
            </div>
        {:then data}
            {#each data.server.services as service}
                <div on:click={() => goto(`/services/${service.name}`)}
                     style="background-color: {service.colorPalette.secondaryColor};"
                     class="inline-grid w-[300px] h-[200px] my-7 ml-16 font-bold text-white text-2xl flex shadow-2xl justify-center items-center backdrop-blur-sm bg-white/40 rounded-2xl hover:scale-110 transition-all duration-300 select-none cursor-pointer">
                    <img src={"/" + service.name + ".png"} onerror="this.onerror=null;this.src='/logo-area.png'"
                         class="flex justify-center items-center h-20 w-20" alt="service"/>
                    <div class="w-full h-full justify-center items-center flex"
                    >{service.name}
                    </div>
                </div>
            {/each}
        {:catch error}
                <div class="flex justify-center items-center">
                    <p>{error.message}</p>
                </div>
        {/await}
    </div>
    <div class="relative flex flex-col justify-center items-center w-screen h-screen backdrop-blur-sm bg-white/40">
        <div class="area-letter text-7xl py-10 px-5 mb-10" style="font-family: 'Pacifico', cursive;">Download our application !</div>
        <div class="flex mb-10">
            <a href="https://expo.dev/artifacts/eas/5Gb8LFqijWnFAqcxQJb18w.apk" class="mx-10 transition-all duration-150 hover:scale-110 bg-black h-[70px] px-4 rounded-xl flex items-center justify-center">
                <Fa icon={icons.faAndroid} size="2.3x" color="#eee" class="mr-4"/>
                <span class="text-white text-2xl font-bold leading-none">Download for android</span>
            </a>
            <div class="mx-10 transition-all duration-150 hover:scale-110 bg-black h-[70px] px-4 rounded-xl flex items-center justify-center">
                <Fa icon={icons.faApple} size="3x" color="#eee" class="mr-4"/>
                <span class="text-white text-2xl font-bold leading-none">Download for ios</span>
            </div>
        </div>
    </div>
</section>