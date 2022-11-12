<script lang="ts">
    import {icons} from "../../../utils/fontAwesome";
    import Fa from "svelte-fa";

    export let data;

    function getStateColor(prefix = "bg-") {
        if (data.active) {
            return prefix + 'green-500';
        } else if (data.locked) {
            return prefix + 'red-500';
        }
        return prefix + 'orange-500';
    }
</script>

<section class="w-full flex justify-between items-center">
    <div class="flex items-center">
        <div class="min-w-[35px]">
            <Fa icon={icons["fa" + data.name] || icons.faPaperPlane} color="{data.colorPalette.mainColor || 'black'}" size="1.25x"/>
        </div>
        <div class="font-light text-lg min-w-[100px]">
            {data.name}
        </div>
    </div>
    <div class="flex items-center justify-start w-full ml-10">
        <div><span class="select-none">actions: </span><b class="text-ui-blue">{data.actions.length}</b></div>
        <div class="ml-12"><span class="select-none">reactions: </span><b class="text-ui-blue">{data.reactions.length}</b></div>
        <div class="ml-12"><span class="select-none">state: </span><b class="{getStateColor('text-')}">{data.active ? 'enabled' : 'disabled'}{data.locked ? ', locked' : ''}</b></div>
    </div>
    <span class="relative flex h-3 w-3 ml-2">
            {#if data.active}<span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full {getStateColor()} opacity-75"></span>{/if}
        <span class="relative inline-flex rounded-full h-3 w-3 {getStateColor()}"></span>
        </span>
</section>
