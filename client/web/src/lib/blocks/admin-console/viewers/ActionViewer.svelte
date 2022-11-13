<script lang="ts">
    import Fa from "svelte-fa";
    import {icons} from "../../../utils/fontAwesome";
    import {clickOutside} from "../../../utils/clickOutside";
    import {beautifyDate, beautifyFullDate} from "$lib/utils/formatDate.js";
    import {fly} from "svelte/transition";
    import {serverUrl} from "../../../../store";

    export let data;

    let showDropDown = false;

    function toggleDropDown() {
        showDropDown = !showDropDown;
    }

    function buildActionType() {
        const actionType = data.actionType.replace("/", ":");
        const reactionType = data.reactionType.replace("/", ":");

        return `${actionType} -> ${reactionType}`;
    }

    let webhookUrl = data.webhookUrl ? `${$serverUrl}${data.webhookUrl}` : undefined;
</script>


<section class="w-full flex justify-center items-center">
    <div class="flex items-center">
        <div class="min-w-[35px]">
            <Fa icon={icons.faBolt} size="1.25x"/>
        </div>
        <div class="font-light text-lg min-w-[150px] leading-none py-1">
            <span class="transition-all duration-100 leading-none">
                {data.name}
            </span>
        </div>
    </div>
    <div class="flex items-center justify-between w-full text-base">
        <div class="font-light">
            <span class="select-none">created: </span><b class="data-value">{beautifyDate(data.createdAt)}</b>
        </div>
        <div class="font-light">
            <span class="select-none">last run: </span><span
                class="data-value">{data.lastRun ? beautifyFullDate(data.lastRun) : 'action not triggered yet'}</span>
        </div>
        <a href="{webhookUrl}" class="flex items-center cursor-pointer hover:border-b-[2px] border-ui-blue transition-all duration-150 relative">
            <span class="select-none">webhook: </span><span
                class="data-value">{data.webhook ? 'true' : 'false'}</span>
            {#if data.webhook}
                <Fa icon={icons.faLink} size="0.85x" color="black" class="ml-1"/>
            {/if}
        </a>
        {#if data.actionPending}
            <div class="relative flex items-center pl-2.5 pr-5">
                <div class="pending-action-class mr-3">
                    <Fa icon={icons.faHourglass} size="1.25x"/>
                </div>
                <span>pending ...</span>
            </div>
        {:else}
            <div>
                <span class="select-none">state: </span><span
                    class="font-bold {data.error ? 'text-red-500' : 'text-green-500'}">{data.error ? 'error' : 'ok'}</span>
            </div>
            <div
                    class:rotate-180={showDropDown}
                    on:click={() => !showDropDown && toggleDropDown()}
                    class="cursor-pointer px-1.5 py-1 h-full rounded-full transition-all duration-150">
                <Fa icon={icons.faArrowDown} size="1.25x"/>
            </div>
        {/if}
    </div>
    {#if showDropDown}
        <div
                in:fly={{duration: 150}}
                use:clickOutside
                on:click_outside={() => showDropDown && toggleDropDown(false)}
                class="z-10 pt-2.5 absolute flex flex-col justify-start items-start viewer-dynamic-width bg-white top-full -left-[1px] border border-t-0 border-gray-400">
            <div class="px-2.5">
                <div class="w-full flex items-center text-2xl">
                    <Fa icon={icons.faUser} size="1.5x"/>
                    <span class="select-none ml-2">from: </span>
                    <div class="ml-2 data-value">{data.user.username}</div>
                </div>
                <div class="mt-4">
                    <span class="select-none">type: </span><span class="data-value">{buildActionType()}</span>
                </div>
                <div>
                    <span class="select-none">last trigger: </span><span
                        class="data-value">{data.lastRun ? beautifyFullDate(data.lastRun) : 'action not triggered yet'}</span>
                </div>
                <div>
                    <span class="select-none">state: </span><span
                        class="font-bold {data.error ? 'text-red-500' : 'text-green-500'}">{data.error ? 'error - ' + data.error : 'ok'}</span>
                </div>
            </div>
            <div class="w-full border-b border-gray-400 border-dashed mt-6"></div>
            <div class="flex flex-wrap px-3.5 py-2">
                {#if data.data}
                    {#each Object.entries(data.data) as dataEntry}
                        <div class="my-1.5 mr-6">
                            <span class="select-none">{dataEntry[0]}: </span><span
                                class="data-value">{dataEntry[1]}</span>
                        </div>
                    {/each}
                {:else}
                    <div class="my-3">
                        <span class="select-none">no data</span>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</section>

<style>
    .viewer-dynamic-width {
        width: calc(100% + 2px);
    }

    .data-value {
        @apply text-ui-blue font-bold;
    }

    .pending-action-class {
        animation: pending-action 1.7s ease-in-out infinite;
    }

    @keyframes pending-action {
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
</style>
