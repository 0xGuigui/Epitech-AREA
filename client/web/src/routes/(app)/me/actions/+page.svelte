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
        <div class="w-full flex flex-wrap justify-center items-center">
            {#if userActions.actions.length > 0}
                {#each userActions.actions as action}
                    <div data-aos="fade-right" data-aos-duration="700">
                        <div
                                class="mx-5 flex my-5 w-[300px] h-[200px] font-bold text-white text-2xl shadow-2xl justify-center items-center rounded-2xl select-none cursor-pointer hover:scale-110 transition-all duration-300 text-center backdrop-blur-sm bg-white/30"
                        >
                            {action.name}
                        </div>
                    </div>
                {/each}
            {/if}
            <div data-aos="fade-left" data-aos-duration="700">
                <div class="mx-5 bg-transparent hover:scale-110 select-none cursor-pointer transition-all duration-150"
                     on:click={() => goto(`/me/create-action`)}>
                    <Fa icon={icons.faPlus} size="5x" primaryColor="#262729"/>
                </div>
            </div>
        </div>
    {/await}
</section>
