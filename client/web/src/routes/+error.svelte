<script>
    import {page} from '$app/stores';
</script>

<section class="relative flex flex-col justify-center items-center w-screen h-screen">
    <a href="/"
       class="absolute top-5 left-6 text-white font-bold text-xl rounded-full hover:scale-110 transition-all duration-150">
        <div class="relative w-full h-full px-5 py-2 bg-area-header rounded-full">
            <span class="area-letter">Go back to heaven</span>
            <div class="absolute top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2 dynamic-size area-fade2 -z-10 rounded-full"></div>
        </div>
    </a>
    <div class="relative text-area-header text-[300px] font-bold">
        <span class="select-none area-letter leading-[40px]" style="font-family: 'Pacifico', cursive;">{$page.status}</span>
    </div>
</section>

<style>
    .dynamic-size {
        width: calc(100% + 6px);
        height: calc(100% + 6px);
    }
</style>
