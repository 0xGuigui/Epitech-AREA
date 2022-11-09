<script>
    import AreaButton from "$lib/components/AreaButton.svelte";
    import {icons} from "$lib/utils/fontAwesome";
    import Fa from "svelte-fa";



    //async function getActions(form) {
        //const response = await fetch(`${config.serverUrl}/me/actions`, {
            //method: 'GET',
            //headers: {
                //'Content-Type': 'application/json',
                //'Authorization': 'Bearer <token>'
            //},
            //body: JSON.stringify(form)
        //})
        //const json = await response.json()
        //return {
            //status: response.status,
            //...json
        //}
    //}
</script>

<section class="h-[100vh] w-[100vw] area-fade2 flex justify-center items-center">
    <div data-aos="fade-down" data-aos-duration="700">
        <div on:click={() => {}} class="bg-transparent hover:scale-110 select-none cursor-pointer transition-all duration-150">
            <Fa icon={icons.faPlus} size="5x" primaryColor="#262729"/>
        </div>
    </div>
</section>