<script lang="ts">
    import Fa from "svelte-fa";
    import {icons} from "../../../utils/fontAwesome";
    import {beautifyDate} from "$lib/utils/formatDate.js";

    export let data;
</script>

<section class="w-full flex justify-start items-center">
    <div class="flex items-center">
        <div class="min-w-[35px]">
            <Fa icon={data.admin ? icons.faUserGear : icons.faUser} class="text-2xl" size="1.25x"/>
        </div>
        <div class="font-light text-lg min-w-[150px]">
            <a href="/users/{data._id}">
                <span class="cursor-pointer relative hover:border-b hover:border-black transition-all duration-100">
                    {data.username}
                    {#if data.admin}
                        <div class="select-none absolute top-0 -right-[53px] flex justify-center items-center text-green-700 text-sm h-4 w-12 ml-2 bg-green-400 border border-green-700 bg-opacity-70 rounded-sm">
                            admin
                        </div>
                    {/if}
                </span>
            </a>
        </div>
    </div>
    <div class="flex items-end justify-between w-full text-base pr-4">
        <div class="font-light min-w-[100px]">
            <span class="select-none">email: </span><a href="mailto:{data.email}"><b class="text-ui-blue font-bold hover:border-b hover:border-ui-blue transition-all duration-100">{data.email}</b></a>
        </div>
        <div>
            <span class="select-none">member since: </span><b class="text-ui-blue">{beautifyDate(data.createdAt)}</b>
        </div>
        <div>
            <span class="select-none">verified: </span>{@html data.verified ? "<b class='text-green-500'>yes</b>" : "<b class='text-red-500'>no</b>"}
        </div>
    </div>
</section>
