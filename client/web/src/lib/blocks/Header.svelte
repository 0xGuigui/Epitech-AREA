<script>
    import AuthGuard from "$lib/components/AuthGuard.svelte";

    export let light = false;
    export let admin = false;

    let scrollY = 0;
    let lastScrollY = 0;
    let direction = "down";
    let hideBreakpoint = 20;

    let computeScrollDirection = () => {
        direction = scrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = scrollY;
    };
</script>

<svelte:window bind:scrollY on:scroll={computeScrollDirection}/>

<section
        class:-translate-y-full={scrollY >= hideBreakpoint && direction === 'down'}
        class="relative flex justify-between items-center w-full h-16 px-5 bg-area-header transition-all duration-200">
    <div>
        <a href="/" class="flex items-center">
            <img src="/logo-area.png" class="mr-2 h-6 sm:h-8 hover:scale-110 duration-150" alt="area_logo"/>
            <span class="text-xl font-bold dark:text-white">AREA</span>
        </a>
    </div>
    <AuthGuard {light} {admin} />
</section>
