<script lang="ts">
	import Actions from "$lib/blocks/admin-console/Actions.svelte";
	import Metrics from "../../../lib/blocks/admin-console/Metrics.svelte";
	import Users from "../../../lib/blocks/admin-console/Users.svelte";
	import Services from "../../../lib/blocks/admin-console/Services.svelte";

	export let data: object;

	const components = {
		"metrics": Metrics,
		"users": Users,
		"actions": Actions,
		"services": Services
	};
	let selectedComponent = "metrics";
</script>

<section class="w-screen h-screen flex flex-col">
	<!-- Header -->
	<div class="bg-area-blue w-full min-h-[70px] flex justify-center items-center px-4">
		<div class="text-white text-center text-3xl">AREA - admin console</div>
	</div>
	<!-- Navigation Menu -->
	<div class="w-full py-3 flex justify-center items-center drop-shadow shadow-gray-500">
		{#each Object.entries(components) as [key, value]}
			<div class="admin-console-tab {selectedComponent === key ? 'border-area-blue' : 'border-transparent'}"
				 on:click={() => { selectedComponent = key }}>
				{key}
			</div>
		{/each}
	</div>
	<!-- Dynamic component -->
	<svelte:component data={data} this={components[selectedComponent]} />
</section>

<style>
    .admin-console-tab {
        @apply flex justify-center items-center px-4 mx-5 h-11 text-xl uppercase cursor-pointer border-b-2;
    }

    .admin-console-tab:hover {
        @apply border-area-blue;
    }
</style>
