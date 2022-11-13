<script class="ts">
    import {icons} from "$lib/utils/fontAwesome";
    import Fa from "svelte-fa";
    import ChooseServicePopup from "$lib/blocks/ChooseServicePopup.svelte";

    let canCreate = false;
    let processing = false;
    let actionContext = {
        name: "new action",
    };
    let kind = "action";
    let showPopup = false;

    function updatePopup() {
        showPopup = !showPopup;
    }

    function submitAction() {
        if (!canCreate) return;
        processing = true;
    }

    function handleServiceFilled(e) {
        updatePopup();
        actionContext[kind] = e.detail
        if (actionContext.action && actionContext.reaction) {
            canCreate = true;
        }
    }
</script>

<section class="flex justify-center items-center h-screen w-full pt-16">
    <div class="relative w-[85%] h-[90%] min-h-[600px] backdrop-blur-sm bg-white/30 rounded-xl">
        {#if showPopup}
            <ChooseServicePopup
                    context={actionContext}
                    on:close={updatePopup}
                    on:message={handleServiceFilled}
                    {kind}
            />
        {:else}
            <div>
                <div class="font-bold text-3xl mt-10 text-area-header w-full text-center">Create a new action:</div>
                <div class="px-10 w-full mt-5"><input bind:value={actionContext.name}/></div>
                <div class="mt-12 flex justify-center items-center px-10">
                    <div on:click={() => {kind = "action"; updatePopup()}}
                         class="select-none w-[32%] relative aspect-square shadow-xl bg-area-header rounded-xl cursor-pointer transition-all duration-150 hover:scale-105">
                        {#if actionContext.action}
                            <span class="text-2xl text-white">ok</span>
                        {:else}
                            <div class="text-white text-2xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                Choose action
                            </div>
                        {/if}
                    </div>
                    <div class="mx-24 transition-all duration-300 {actionContext.action ? 'opacity-100' : 'opacity-0'}">
                        <div class="{actionContext.reaction ? '' : 'animate-bars'}">
                            <Fa icon={icons.faAnglesRight} size="5x" color="#262729"/>
                        </div>
                    </div>
                    <div on:click={() => {if (actionContext.action) {kind = "reaction"; updatePopup()}}}
                         class="select-none w-[32%] relative aspect-square shadow-xl bg-area-header rounded-xl transition-all duration-150 {actionContext.action ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}">
                        {#if actionContext.reaction}
                            <span class="text-2xl text-white">ok</span>
                        {:else}
                            <div class="text-white text-2xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                Choose reaction
                            </div>
                        {/if}
                    </div>
                </div>
                <div on:click={submitAction}
                     class="{processing || !canCreate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'} select-none text-white font-bold text-2xl flex justify-center items-center absolute bottom-3.5 right-5 w-64 h-14 bg-[#695690] rounded-lg transition-all duration-150">
                    {#if processing}
                        <div class="animate-spinner">
                            <Fa icon={icons.faRotate} size="1.5x"/>
                        </div>
                    {:else}
                        Create action
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</section>

<style>
    .animate-spinner {
        animation: loading-animation 1.5s ease-in-out infinite;
    }

    .animate-bars {
        animation: bounce-right-animation 1.5s ease-in-out infinite;
    }

    @keyframes loading-animation {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes bounce-right-animation {
        0% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(14px);
        }
        100% {
            transform: translateX(0);
        }
    }
</style>
