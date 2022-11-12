<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Fa from "svelte-fa";
    import {icons} from "../utils/fontAwesome";

    export let selected = false;

    const dispatch = createEventDispatcher();

    function select() {
        selected = !selected;
        dispatch("select", selected);
    }
</script>

<section on:click={select} class="my-2 mx-3 w-4 h-4 transition-all rounded-sm ring-2 {selected ? 'ring-ui-blue-500 bg-ui-blue' : 'ring-gray-900 bg-white'}">
    <Fa icon={icons.faCheck} class="text-white" />
</section>
