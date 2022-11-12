<script lang="ts">
	import Actions from "../../../lib/blocks/admin-console/Actions.svelte";
	import Metrics from "../../../lib/blocks/admin-console/Metrics.svelte";
	import Users from "../../../lib/blocks/admin-console/Users.svelte";
	import Services from "../../../lib/blocks/admin-console/Services.svelte";
	import {loggedIn} from "../../../store";

	export let data: object;

	const components = {
		"Metrics": Metrics,
		"Users": Users,
		"Actions": Actions,
		"Services": Services
	};
	let selectedComponent = "Users";
</script>

<section class="w-screen min-h-screen flex flex-col">
	{#if $loggedIn && data.user?.admin}
		<!-- Navigation Menu -->
		<div class="w-full flex justify-center items-center drop-shadow-sm shadow shadow-gray-300 border-b border-gray-300">
			{#each Object.entries(components) as [key, value]}
				<div
						class:hover:bg-gray-100={selectedComponent !== key}
						class="admin-console-tab {selectedComponent === key ? 'border-ui-blue bg-ui-blue bg-opacity-10' : 'border-transparent'}"
					 on:click={() => { selectedComponent = key }}>
					{key}
				</div>
			{/each}
		</div>
		<!-- Dynamic component -->
		<svelte:component data={data} this={components[selectedComponent]} />
	{:else}
		<div class="w-full h-screen flex justify-center items-center">
			test
		</div>
	{/if}
</section>

<style>
    .admin-console-tab {
        @apply flex justify-center items-center min-w-[135px] py-3 transition-all duration-150 px-3 text-xl font-bold cursor-pointer border-b-[3px];
    }
</style>
