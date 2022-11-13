<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {serverUrl} from "../../../../store";

    export let data;

    let services = getServices();

    async function getServices() {
        const response = await fetch($serverUrl + '/about.json')
        const json = await response.json()
	    console.log(json)
        return {
            status: response.status,
            ...json
        };
    }

    let desc = []

    function onClickHandler(action) {
		if (desc.find(e => e === action.name))
			desc = [...desc.filter(e => e !== action.name)]
		else {
			desc = [...desc, action.name]
		}
	}
</script>

<section>
    {#await services}
        <p></p>
    {:then data}
        {#each data.server.services as service}
            {#if service.name === $page.params.service}
                <div style="background-color: {service.colorPalette.mainColor};" class="flex flex-col justify-end items-center h-[100vh] w-[100vw]">
                    <button class="absolute h-8 w-32 right-16 top-24 outline outline-offset-8 outline-4 backdrop-blur-sm white/50 text-xl text-white font-bold rounded-full hover:scale-110 transition-all duration-150 select-none cursor-pointer" type="submit"
                            on:click={() => goto(service.colorPalette.urlSite)}>Visit {service.name}</button>
                    <button class="absolute h-8 w-32 left-16 top-24 outline outline-offset-8 outline-4 backdrop-blur-sm white/50 text-xl text-white font-bold rounded-full hover:scale-110 transition-all duration-150 select-none cursor-pointer" type="submit"
                            on:click={() => goto(`/`)}>{"< Back"}</button>
                    <div class="flex flex-col justify-center items-center">
                        <h1 class="text-6xl text-white font-bold">{service.name}</h1>
                        <p class="my-7 max-w-[600px] text-xl text-center text-white font-semibold">{service.description}</p>
                        <button class="mb-72 my-7 py-3 px-5 flex block justify-center items-center bg-white text-2xl text-area-header font-bold rounded-full hover:bg-gray-300 hover:scale-110 transition-all duration-150 select-none cursor-pointer shadow-md" type="submit"
                                on:click={() => goto(`/me/create-action`)}>Create {service.name} action</button>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center bg-white w-full">
                    {#if service.actions.length > 0}
                        <p class="font-bold text-4xl text-area-header">Actions</p>
                        <div class="w-[50px] h-[4px] bg-area-header text-black font-bold rounded-2xl"></div>
                        <div class="w-full flex flex-wrap justify-center">
                            {#each service.actions as action}
                                <div style="background-color: {service.colorPalette.secondaryColor};"
                                     class="inline-grid mx-5 flex my-5 w-[300px] h-[200px] font-bold text-white text-2xl shadow-2xl justify-center items-center rounded-2xl select-none cursor-pointer hover:scale-110 transition-all duration-300 text-center"
                                     on:click={() => onClickHandler(action)}
                                >
                                    {desc.find(e => e === action.name) ? action.description: action.name}
                                </div>
                            {/each}
                        </div>
                    {/if}
                    {#if service.reactions.length > 0}
                        <p class="font-bold text-4xl text-area-header">Reactions</p>
                        <div class="w-[50px] h-[4px] bg-area-header text-black font-bold rounded-2xl"></div>
                        <div class="w-full flex flex-wrap justify-center">
                            {#each service.reactions as reaction}
                                <div style="background-color: {service.colorPalette.secondaryColor};"
                                     class="mx-5 flex my-5 w-[300px] h-[200px] font-bold text-white text-2xl shadow-2xl justify-center items-center rounded-2xl select-none cursor-pointer hover:scale-110 transition-all duration-300 text-center"
                                     on:click={() => onClickHandler(reaction)}
                                >
                                    {desc.find(e => e === reaction.name) ? reaction.description: reaction.name}
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    {/await}
</section>
