<script>
    let scrollY;
    let buffer;
    let direction;

    $: {
        direction = scrollY > buffer ? 'down' : 'up';
        buffer = scrollY;
    }
</script>

<svelte:window bind:scrollY/>

<section class="bg-area-header py-3 shadow-xl flex justify-center items-center fixed top-O w-full transition-all duration-250 px-5"
        class:-translate-y-full={scrollY >= 300 && direction === 'down'}>
    <div class="flex justify-between items-center w-full">
        <a href="/" class="flex items-center">
            <img src="./logo-area.png" class="mr-2 h-6 sm:h-8 hover:scale-110 duration-150" alt="area_logo"/>
            <span class="text-xl font-bold dark:text-white">AREA</span>
        </a>
        <div class="flex items-center lg:order-2 text-white">
            <a href="/"
               class="font-bold mr-2 py-2 px-6 bg-area-button hover:bg-area-blue hover:scale-110 transition-all duration-150 rounded-lg">Log
                in</a>
            <a href="/"
               class="font-bold ml-2 py-2 px-6 bg-area-button hover:bg-area-blue hover:scale-110 transition-all duration-150 rounded-lg">Register</a>
            <button>
                <span></span>
            </button>
        </div>
    </div>
</section>

<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>
<p>salut</p>