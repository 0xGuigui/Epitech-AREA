<script>
    import AreaButton from "$lib/components/AreaButton.svelte";
    import {icons} from "../../../../lib/utils/fontAwesome.ts";
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

<section class="h-[100vh] w-[100vw] area-fade2 flex block">
    <AreaButton on:click={() => {}}>
        <Fa icon={icons.faUser}/>
    </AreaButton>
</section>