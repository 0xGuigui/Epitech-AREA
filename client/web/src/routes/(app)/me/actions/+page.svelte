<script>
    import {icons} from "$lib/utils/fontAwesome";
    import {areaFetch} from "../../../../lib/utils/areaFetch";
    import {goto} from "$app/navigation";
    import Fa from "svelte-fa";

    export let data;

    let userActions = getUserActions();
    let user = data.user;

    async function getUserActions() {
        const response = await areaFetch('/me/actions')
        const json = await response.json()
        return {
            status: response.status,
            ...json
        };
    }
</script>

<section class="h-[100vh] w-[100vw] area-fade2 flex justify-center items-center">
    {#await userActions}
        <p></p>
    {:then userActions}
        {#if userActions.actions.length > 0}
            {#each userActions.actions as action}
                <div data-aos="fade-down" data-aos-duration="700">
                    <div class="bg-transparent hover:scale-110 select-none cursor-pointer transition-all duration-150">
                        <Fa icon={icons.faPlus} size="5x" primaryColor="#262729"/>
                    </div>
                </div>
            {/each}
        {:else}
            <div data-aos="fade-down" data-aos-duration="700">
                <div class="bg-transparent hover:scale-110 select-none cursor-pointer transition-all duration-150"
                     on:click={() => goto(`/me/create-actions`)}>
                    <Fa icon={icons.faPlus} size="5x" primaryColor="#262729"/>
                </div>
            </div>
        {/if}
    {/await}
</section>