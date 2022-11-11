<script lang="ts">
	import {areaFetch} from "../../utils/areaFetch";
	import ListBuilder from "$lib/components/ListBuilder.svelte";
	import UserViewer from "$lib/blocks/admin-console/viewers/UserViewer.svelte";

	async function fetchUsers() {
		let response = await areaFetch("/users");
		usersPromise = response.json();
	}

	let usersPromise = fetchUsers();
</script>

<section>
	{#await usersPromise}
		<div class="w-screen h-screen flex justify-center items-center">
			<img src="/loaders/ball-triangle.svg" alt="Loading svg">
		</div>
	{:then users}
		<ListBuilder dataList={users.users} hasExtraData={false} viewer={UserViewer} />
	{:catch error}
		<div class="w-screen h-screen flex justify-center items-center">
			An error occurred: {error.message}
		</div>
	{/await}
</section>
