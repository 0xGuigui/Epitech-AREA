<script>
    import {icons} from "$lib/utils/fontAwesome";
    import Fa from "svelte-fa";
</script>

<section class="h-[100vh] w-[100vw] area-fade2 flex justify-center items-center">
    <div data-aos="fade-down" data-aos-duration="700">
        <div class="bg-transparent hover:scale-110 select-none cursor-pointer transition-all duration-150">
            <Fa icon={icons.faPlus} size="5x" primaryColor="#262729"/>
        </div>
    </div>
</section>